use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ExplorationState, ExplorationStatus, ProtocolConfig};
use crate::errors::RigItError;
use crate::events::BuybackBudgetAllocated;

#[derive(Accounts)]
pub struct AllocateBuybackBudget<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        constraint = exploration_state.status == ExplorationStatus::Settled @ RigItError::ExplorationNotSettled,
        constraint = !exploration_state.buyback_allocated @ RigItError::BuybackAlreadyAllocated,
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

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

    // Treasury vaults
    #[account(
        mut,
        seeds = [b"treasury", b"buyback_burn"],
        bump
    )]
    pub treasury_buyback_burn: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"treasury", b"buyback_lp"],
        bump
    )]
    pub treasury_buyback_lp: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"treasury", b"team_ops"],
        bump
    )]
    pub treasury_team_ops: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"treasury", b"ecosystem"],
        bump
    )]
    pub treasury_ecosystem: Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = operator.key() == protocol_config.operator @ RigItError::Unauthorized
    )]
    pub operator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<AllocateBuybackBudget>) -> Result<()> {
    let config = &ctx.accounts.protocol_config;
    let exploration = &mut ctx.accounts.exploration_state;
    let r = exploration.remaining_pool as u128;

    // Calculate allocations from R
    // Note: winner_share (50%) is claimed separately by winners
    // Remaining 50% of R goes to: buyback_burn (15%) + buyback_lp (15%) + team (10%) + ecosystem (10%)
    
    let burn_amount = r
        .checked_mul(config.buyback_burn_bps as u128)
        .ok_or(RigItError::ArithmeticOverflow)?
        / 10000;
    
    let lp_amount = r
        .checked_mul(config.buyback_lp_bps as u128)
        .ok_or(RigItError::ArithmeticOverflow)?
        / 10000;
    
    let team_amount = r
        .checked_mul(config.team_ops_bps as u128)
        .ok_or(RigItError::ArithmeticOverflow)?
        / 10000;
    
    let ecosystem_amount = r
        .checked_mul(config.ecosystem_bps as u128)
        .ok_or(RigItError::ArithmeticOverflow)?
        / 10000;

    let block_id = exploration.block_id;
    let seeds = &[
        b"block_vault_authority".as_ref(),
        &[block_id],
        &[ctx.bumps.block_vault_authority],
    ];
    let signer_seeds = &[&seeds[..]];

    // Transfer to buyback burn treasury
    if burn_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.block_vault.to_account_info(),
            to: ctx.accounts.treasury_buyback_burn.to_account_info(),
            authority: ctx.accounts.block_vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, burn_amount as u64)?;
    }

    // Transfer to buyback LP treasury
    if lp_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.block_vault.to_account_info(),
            to: ctx.accounts.treasury_buyback_lp.to_account_info(),
            authority: ctx.accounts.block_vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, lp_amount as u64)?;
    }

    // Transfer to team ops treasury
    if team_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.block_vault.to_account_info(),
            to: ctx.accounts.treasury_team_ops.to_account_info(),
            authority: ctx.accounts.block_vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, team_amount as u64)?;
    }

    // Transfer to ecosystem treasury
    if ecosystem_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.block_vault.to_account_info(),
            to: ctx.accounts.treasury_ecosystem.to_account_info(),
            authority: ctx.accounts.block_vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, ecosystem_amount as u64)?;
    }

    // Mark as allocated
    exploration.buyback_allocated = true;

    emit!(BuybackBudgetAllocated {
        exploration_key: exploration.key(),
        remaining_pool: exploration.remaining_pool,
        burn_amount: burn_amount as u64,
        lp_amount: lp_amount as u64,
        team_amount: team_amount as u64,
        ecosystem_amount: ecosystem_amount as u64,
    });

    msg!(
        "Buyback budget allocated: burn={}, lp={}, team={}, ecosystem={}",
        burn_amount,
        lp_amount,
        team_amount,
        ecosystem_amount
    );

    Ok(())
}
