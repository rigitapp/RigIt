use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::{BlockState, ProtocolConfig};
use crate::errors::RigItError;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitBlockArgs {
    pub block_id: u8,
    pub min_threshold: u64,
}

#[derive(Accounts)]
#[instruction(args: InitBlockArgs)]
pub struct InitBlock<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
        has_one = admin @ RigItError::Unauthorized,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        init,
        payer = admin,
        space = BlockState::LEN,
        seeds = [BlockState::SEED, &[args.block_id]],
        bump
    )]
    pub block_state: Account<'info, BlockState>,

    #[account(
        init,
        payer = admin,
        token::mint = asset_mint,
        token::authority = block_vault_authority,
        seeds = [b"block_vault", args.block_id.to_le_bytes().as_ref()],
        bump
    )]
    pub block_vault: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for vault
    #[account(
        seeds = [b"block_vault_auth", args.block_id.to_le_bytes().as_ref()],
        bump
    )]
    pub block_vault_authority: UncheckedAccount<'info>,

    /// Asset mint for this block (SOL uses wrapped SOL mint)
    pub asset_mint: Account<'info, Mint>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitBlock>, args: InitBlockArgs) -> Result<()> {
    require!(args.block_id <= 2, RigItError::InvalidBlockId);

    let block = &mut ctx.accounts.block_state;

    block.block_id = args.block_id;
    block.asset_mint = ctx.accounts.asset_mint.key();
    block.asset_decimals = ctx.accounts.asset_mint.decimals;
    block.min_threshold = args.min_threshold;
    block.current_exploration_index = 0;
    block.paused = false;
    block.total_volume = 0;
    block.total_explorations_completed = 0;
    block.bump = ctx.bumps.block_state;

    msg!("Block {} initialized", args.block_id);
    msg!("Asset mint: {}", block.asset_mint);
    msg!("Min threshold: {}", block.min_threshold);

    Ok(())
}
