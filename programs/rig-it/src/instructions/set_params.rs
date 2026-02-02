use anchor_lang::prelude::*;

use crate::state::ProtocolConfig;
use crate::errors::RigItError;
use crate::events::ParamsUpdated;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SetParamsArgs {
    pub active_duration_secs: Option<u32>,
    pub cooldown_duration_secs: Option<u32>,
    pub anti_snipe_window_secs: Option<u32>,
    pub commit_reveal_timeout_slots: Option<u64>,
    pub new_operator: Option<Pubkey>,
    pub new_emergency_admin: Option<Pubkey>,
}

#[derive(Accounts)]
pub struct SetParams<'info> {
    #[account(
        mut,
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
        has_one = admin @ RigItError::Unauthorized,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    pub admin: Signer<'info>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<SetParams>, args: SetParamsArgs) -> Result<()> {
    let config = &mut ctx.accounts.protocol_config;
    let clock = &ctx.accounts.clock;

    // Apply updates
    if let Some(val) = args.active_duration_secs {
        config.active_duration_secs = val;
    }
    if let Some(val) = args.cooldown_duration_secs {
        config.cooldown_duration_secs = val;
    }
    if let Some(val) = args.anti_snipe_window_secs {
        config.anti_snipe_window_secs = val;
    }
    if let Some(val) = args.commit_reveal_timeout_slots {
        config.commit_reveal_timeout_slots = val;
    }
    if let Some(val) = args.new_operator {
        config.operator = val;
    }
    if let Some(val) = args.new_emergency_admin {
        config.emergency_admin = val;
    }

    emit!(ParamsUpdated {
        updated_by: ctx.accounts.admin.key(),
        timestamp: clock.unix_timestamp,
    });

    msg!("Protocol parameters updated");

    Ok(())
}
