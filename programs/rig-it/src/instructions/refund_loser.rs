use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{DepositReceipt, ExplorationState, ExplorationStatus, RigState};
use crate::errors::RigItError;
use crate::events::LoserRefunded;

#[derive(Accounts)]
pub struct RefundLoser<'info> {
    #[account(
        constraint = exploration_state.status == ExplorationStatus::Settled @ RigItError::ExplorationNotSettled,
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

    #[account(
        constraint = rig_state.exploration == exploration_state.key(),
    )]
    pub rig_state: Account<'info, RigState>,

    #[account(
        mut,
        constraint = deposit_receipt.rig == rig_state.key(),
        constraint = deposit_receipt.exploration == exploration_state.key(),
        constraint = deposit_receipt.user == user.key() @ RigItError::Unauthorized,
        constraint = !deposit_receipt.refund_claimed @ RigItError::RefundAlreadyClaimed,
        constraint = !deposit_receipt.is_anti_sniped, // Anti-sniped deposits handled separately
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
    pub block_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK: PDA authority for vault
    #[account(
        seeds = [b"block_vault_authority", &[exploration_state.block_id]],
        bump
    )]
    pub block_vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<RefundLoser>) -> Result<()> {
    let exploration = &ctx.accounts.exploration_state;
    let rig = &ctx.accounts.rig_state;
    let receipt = &mut ctx.accounts.deposit_receipt;

    // Verify this rig did NOT win
    let winning_rig = exploration.winning_rig.ok_or(RigItError::ExplorationNotSettled)?;
    require!(rig.rig_index != winning_rig, RigItError::NotALoser);

    // Calculate refund: 50% of original deposit
    let refund_amount = receipt.amount / 2;

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
    token::transfer(cpi_ctx, refund_amount)?;

    // Mark as claimed
    receipt.refund_claimed = true;

    emit!(LoserRefunded {
        user: receipt.user,
        exploration_key: exploration.key(),
        deposit_receipt: receipt.key(),
        original_amount: receipt.amount,
        refund_amount,
    });

    msg!(
        "Refunded {} to user {} (50% of {} deposit)",
        refund_amount,
        receipt.user,
        receipt.amount
    );

    Ok(())
}
