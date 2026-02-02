use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::state::{
    BlockState, DepositReceipt, ExplorationState, ExplorationStatus, 
    ProtocolConfig, RigState, RIGS_PER_EXPLORATION,
};
use crate::errors::RigItError;
use crate::events::{AntiSnipedDepositClaimed, DepositMade};
use crate::utils::{calculate_effective_tickets, MIN_DEPOSIT_AMOUNT};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DepositToRigArgs {
    pub rig_index: u8,
    pub amount: u64,
    pub deposit_nonce: u64,
}

#[derive(Accounts)]
#[instruction(args: DepositToRigArgs)]
pub struct DepositToRig<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
        constraint = !protocol_config.paused @ RigItError::ProtocolPaused,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        seeds = [BlockState::SEED, &[block_state.block_id]],
        bump = block_state.bump,
        constraint = !block_state.paused @ RigItError::BlockPaused,
    )]
    pub block_state: Account<'info, BlockState>,

    #[account(
        mut,
        seeds = [
            ExplorationState::SEED,
            &[exploration_state.block_id],
            &exploration_state.exploration_index.to_le_bytes()
        ],
        bump = exploration_state.bump,
        constraint = exploration_state.status == ExplorationStatus::Active @ RigItError::ExplorationNotActive,
    )]
    pub exploration_state: Account<'info, ExplorationState>,

    #[account(
        init_if_needed,
        payer = user,
        space = RigState::LEN,
        seeds = [RigState::SEED, exploration_state.key().as_ref(), &[args.rig_index]],
        bump
    )]
    pub rig_state: Account<'info, RigState>,

    #[account(
        init,
        payer = user,
        space = DepositReceipt::LEN,
        seeds = [
            DepositReceipt::SEED,
            rig_state.key().as_ref(),
            user.key().as_ref(),
            &args.deposit_nonce.to_le_bytes()
        ],
        bump
    )]
    pub deposit_receipt: Account<'info, DepositReceipt>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == block_state.asset_mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"block_vault", &[block_state.block_id]],
        bump,
        constraint = block_vault.mint == block_state.asset_mint,
    )]
    pub block_vault: Account<'info, TokenAccount>,

    /// Optional: User's $RIG token account for multiplier calculation
    pub user_rig_token_account: Option<Account<'info, TokenAccount>>,

    /// $RIG token mint (for validation)
    pub rig_token_mint: Option<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<DepositToRig>, args: DepositToRigArgs) -> Result<()> {
    // Validate inputs
    require!(
        args.rig_index < RIGS_PER_EXPLORATION as u8,
        RigItError::InvalidRigIndex
    );
    require!(args.amount >= MIN_DEPOSIT_AMOUNT, RigItError::DepositTooSmall);

    let config = &ctx.accounts.protocol_config;
    let exploration = &mut ctx.accounts.exploration_state;
    let rig = &mut ctx.accounts.rig_state;
    let receipt = &mut ctx.accounts.deposit_receipt;
    let clock = &ctx.accounts.clock;
    let current_ts = clock.unix_timestamp;

    // Check if in anti-snipe window
    let is_anti_sniped = exploration.is_anti_snipe_window(current_ts, config.anti_snipe_window_secs);

    // Get $RIG balance for multiplier
    let rig_balance = ctx
        .accounts
        .user_rig_token_account
        .as_ref()
        .map(|acc| acc.amount)
        .unwrap_or(0);

    // Calculate effective tickets
    let effective_tickets = calculate_effective_tickets(args.amount, rig_balance);

    // Initialize rig state if new
    if rig.exploration == Pubkey::default() {
        rig.exploration = exploration.key();
        rig.rig_index = args.rig_index;
        rig.bump = ctx.bumps.rig_state;
    }

    // Initialize deposit receipt
    receipt.user = ctx.accounts.user.key();
    receipt.rig = rig.key();
    receipt.rig_index = args.rig_index;
    receipt.exploration = exploration.key();
    receipt.amount = args.amount;
    receipt.effective_tickets = effective_tickets;
    receipt.deposited_at = current_ts;
    receipt.deposit_nonce = args.deposit_nonce;
    receipt.is_anti_sniped = is_anti_sniped;
    receipt.rolled_to_exploration = None;
    receipt.refund_claimed = false;
    receipt.winnings_claimed = false;
    receipt.bump = ctx.bumps.deposit_receipt;

    // Transfer tokens to vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.block_vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, args.amount)?;

    // Update state only if NOT anti-sniped
    // Anti-sniped deposits are held but don't affect current exploration
    if !is_anti_sniped {
        rig.total_deposits = rig
            .total_deposits
            .checked_add(args.amount)
            .ok_or(RigItError::ArithmeticOverflow)?;
        rig.total_tickets = rig
            .total_tickets
            .checked_add(effective_tickets)
            .ok_or(RigItError::ArithmeticOverflow)?;
        rig.deposit_count = rig
            .deposit_count
            .checked_add(1)
            .ok_or(RigItError::ArithmeticOverflow)?;

        exploration.total_deposits = exploration
            .total_deposits
            .checked_add(args.amount)
            .ok_or(RigItError::ArithmeticOverflow)?;
        exploration.rig_deposits[args.rig_index as usize] = exploration.rig_deposits
            [args.rig_index as usize]
            .checked_add(args.amount)
            .ok_or(RigItError::ArithmeticOverflow)?;
        exploration.rig_tickets[args.rig_index as usize] = exploration.rig_tickets
            [args.rig_index as usize]
            .checked_add(effective_tickets)
            .ok_or(RigItError::ArithmeticOverflow)?;
    }

    // Emit event
    emit!(DepositMade {
        user: receipt.user,
        block_id: exploration.block_id,
        exploration_index: exploration.exploration_index,
        exploration_key: exploration.key(),
        rig_index: args.rig_index,
        amount: args.amount,
        effective_tickets,
        is_anti_sniped,
        deposit_receipt: receipt.key(),
    });

    msg!(
        "Deposit of {} to rig {} (anti-sniped: {})",
        args.amount,
        args.rig_index,
        is_anti_sniped
    );

    Ok(())
}

// === Claim Anti-Sniped Deposit ===

#[derive(Accounts)]
pub struct ClaimAntiSnipedDeposit<'info> {
    #[account(
        mut,
        constraint = original_receipt.is_anti_sniped @ RigItError::DepositNotAntiSniped,
        constraint = original_receipt.rolled_to_exploration.is_none() @ RigItError::DepositAlreadyRolledOver,
        constraint = original_receipt.user == user.key() @ RigItError::Unauthorized,
    )]
    pub original_receipt: Account<'info, DepositReceipt>,

    #[account(
        mut,
        constraint = next_exploration.status == ExplorationStatus::Active @ RigItError::ExplorationNotActive,
    )]
    pub next_exploration: Account<'info, ExplorationState>,

    #[account(
        init_if_needed,
        payer = user,
        space = RigState::LEN,
        seeds = [
            RigState::SEED,
            next_exploration.key().as_ref(),
            &[original_receipt.rig_index] // same rig index as original deposit
        ],
        bump
    )]
    pub next_rig_state: Account<'info, RigState>,

    #[account(
        init,
        payer = user,
        space = DepositReceipt::LEN,
        seeds = [
            DepositReceipt::SEED,
            next_rig_state.key().as_ref(),
            user.key().as_ref(),
            &original_receipt.deposit_nonce.to_le_bytes() // Reuse nonce
        ],
        bump
    )]
    pub new_receipt: Account<'info, DepositReceipt>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn claim_anti_sniped_handler(ctx: Context<ClaimAntiSnipedDeposit>) -> Result<()> {
    let original = &mut ctx.accounts.original_receipt;
    let next_exp = &mut ctx.accounts.next_exploration;
    let next_rig = &mut ctx.accounts.next_rig_state;
    let new_receipt = &mut ctx.accounts.new_receipt;
    let clock = &ctx.accounts.clock;

    // Use rig index stored in the original receipt
    let rig_index = original.rig_index;

    // Initialize new rig state if needed
    if next_rig.exploration == Pubkey::default() {
        next_rig.exploration = next_exp.key();
        next_rig.rig_index = rig_index;
        next_rig.bump = ctx.bumps.next_rig_state;
    }

    // Create new receipt with same terms
    new_receipt.user = original.user;
    new_receipt.rig = next_rig.key();
    new_receipt.rig_index = rig_index;
    new_receipt.exploration = next_exp.key();
    new_receipt.amount = original.amount;
    new_receipt.effective_tickets = original.effective_tickets;
    new_receipt.deposited_at = clock.unix_timestamp;
    new_receipt.deposit_nonce = original.deposit_nonce;
    new_receipt.is_anti_sniped = false; // Now a normal deposit
    new_receipt.rolled_to_exploration = None;
    new_receipt.refund_claimed = false;
    new_receipt.winnings_claimed = false;
    new_receipt.bump = ctx.bumps.new_receipt;

    // Update next exploration and rig totals
    next_rig.total_deposits = next_rig
        .total_deposits
        .checked_add(original.amount)
        .ok_or(RigItError::ArithmeticOverflow)?;
    next_rig.total_tickets = next_rig
        .total_tickets
        .checked_add(original.effective_tickets)
        .ok_or(RigItError::ArithmeticOverflow)?;
    next_rig.deposit_count = next_rig
        .deposit_count
        .checked_add(1)
        .ok_or(RigItError::ArithmeticOverflow)?;

    next_exp.total_deposits = next_exp
        .total_deposits
        .checked_add(original.amount)
        .ok_or(RigItError::ArithmeticOverflow)?;
    next_exp.rig_deposits[rig_index as usize] = next_exp.rig_deposits[rig_index as usize]
        .checked_add(original.amount)
        .ok_or(RigItError::ArithmeticOverflow)?;
    next_exp.rig_tickets[rig_index as usize] = next_exp.rig_tickets[rig_index as usize]
        .checked_add(original.effective_tickets)
        .ok_or(RigItError::ArithmeticOverflow)?;

    // Mark original as rolled
    original.rolled_to_exploration = Some(next_exp.key());

    emit!(AntiSnipedDepositClaimed {
        original_deposit: original.key(),
        new_deposit: new_receipt.key(),
        user: original.user,
        amount: original.amount,
        new_exploration: next_exp.key(),
    });

    Ok(())
}
