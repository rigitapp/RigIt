use anchor_lang::prelude::*;

use crate::state::ProtocolConfig;
use crate::errors::RigItError;
use crate::events::ProtocolPaused;

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(
        mut,
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    /// Admin or Emergency Admin can pause
    #[account(
        constraint = 
            authority.key() == protocol_config.admin ||
            authority.key() == protocol_config.emergency_admin
        @ RigItError::Unauthorized
    )]
    pub authority: Signer<'info>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<EmergencyPause>, pause: bool) -> Result<()> {
    let config = &mut ctx.accounts.protocol_config;
    let clock = &ctx.accounts.clock;

    config.paused = pause;

    emit!(ProtocolPaused {
        paused_by: ctx.accounts.authority.key(),
        paused: pause,
        timestamp: clock.unix_timestamp,
    });

    msg!(
        "Protocol {} by {}",
        if pause { "PAUSED" } else { "UNPAUSED" },
        ctx.accounts.authority.key()
    );

    Ok(())
}
