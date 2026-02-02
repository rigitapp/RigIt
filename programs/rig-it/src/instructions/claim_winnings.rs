use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{DepositReceipt, ExplorationState, ExplorationStatus, ProtocolConfig, RigState};
use crate::errors::RigItError;
use crate::events::WinningsClaimed;

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        constraint = exploration_state.status == ExplorationStatus::Settled @ RigItError::ExplorationNotSettled,
    )]
    pub exploration_state: Account<'info, ExplorationState>,

    #[account(
        constraint = rig_state.exploration == exploration_state.key(),
    )]
    pub rig_state: Account<'info, RigState>,

    #[account(
        mut,
        constraint = deposit_receipt.rig == rig_state.key(),
        constraint = deposit_receipt.exploration == exploration_state.key(),
        constraint = deposit_receipt.user == user.key() @ RigItError::Unauthorized,
        constraint = !deposit_receipt.winnings_claimed @ RigItError::WinningsAlreadyClaimed,
        constraint = !deposit_receipt.is_anti_sniped, // Anti-sniped deposits can't win in original exploration
    )]
    pub deposit_receipt: Account<'info, DepositReceipt>,

    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"block_vault", &[exploration_state.block_id]],
        bump,
    )]
    pub block_vault: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for vault
    #[account(
        seeds = [b"block_vault_authority", &[exploration_state.block_id]],
        bump
    )]
    pub block_vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimWinnings>) -> Result<()> {
    let config = &ctx.accounts.protocol_config;
    let exploration = &ctx.accounts.exploration_state;
    let rig = &ctx.accounts.rig_state;
    let receipt = &mut ctx.accounts.deposit_receipt;

    // Verify this rig WON
    let winning_rig = exploration.winning_rig.ok_or(RigItError::ExplorationNotSettled)?;
    require!(rig.rig_index == winning_rig, RigItError::NotAWinner);

    // Calculate winner's share
    // Winner pool = 50% of R
    // User's share = winner_pool * (user_tickets / winning_rig_total_tickets)
    let r = exploration.remaining_pool;
    let winner_pool = (r as u128)
        .checked_mul(config.winner_share_bps as u128)
        .ok_or(RigItError::ArithmeticOverflow)?
        / 10000;

    let winning_rig_tickets = exploration.rig_tickets[winning_rig as usize];
    require!(winning_rig_tickets > 0, RigItError::ArithmeticOverflow);

    let user_share = winner_pool
        .checked_mul(receipt.effective_tickets)
        .ok_or(RigItError::ArithmeticOverflow)?
        / winning_rig_tickets;

    let payout_amount = user_share as u64;

    // Transfer from vault to user
    let block_id = exploration.block_id;
    let seeds = &[
        b"block_vault_authority".as_ref(),
        &[block_id],
        &[ctx.bumps.block_vault_authority],
    ];
    let signer_seeds = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.block_vault.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.block_vault_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    token::transfer(cpi_ctx, payout_amount)?;

    // Mark as claimed
    receipt.winnings_claimed = true;

    emit!(WinningsClaimed {
        user: receipt.user,
        exploration_key: exploration.key(),
        deposit_receipt: receipt.key(),
        effective_tickets: receipt.effective_tickets,
        winning_amount: payout_amount,
    });

    msg!(
        "Winner {} claimed {} (tickets: {}/{})",
        receipt.user,
        payout_amount,
        receipt.effective_tickets,
        winning_rig_tickets
    );

    Ok(())
}
