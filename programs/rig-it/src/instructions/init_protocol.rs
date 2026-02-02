use anchor_lang::prelude::*;

use crate::state::ProtocolConfig;
use crate::errors::RigItError;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitProtocolArgs {
    pub operator: Pubkey,
    pub emergency_admin: Pubkey,
}

#[derive(Accounts)]
pub struct InitProtocol<'info> {
    #[account(
        init,
        payer = admin,
        space = ProtocolConfig::LEN,
        seeds = [ProtocolConfig::SEED],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    /// $RIG token mint
    pub rig_token_mint: Account<'info, anchor_spl::token::Mint>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitProtocol>, args: InitProtocolArgs) -> Result<()> {
    let config = &mut ctx.accounts.protocol_config;

    config.admin = ctx.accounts.admin.key();
    config.operator = args.operator;
    config.rig_token_mint = ctx.accounts.rig_token_mint.key();
    config.emergency_admin = args.emergency_admin;
    config.paused = false;
    config.bump = ctx.bumps.protocol_config;

    // Set default fee splits and timing
    config.init_defaults();

    // Validate fee splits
    require!(
        config.validate_fee_splits(),
        RigItError::InvalidFeeSplit
    );

    msg!("Protocol initialized");
    msg!("Admin: {}", config.admin);
    msg!("Operator: {}", config.operator);
    msg!("$RIG Token: {}", config.rig_token_mint);

    Ok(())
}
