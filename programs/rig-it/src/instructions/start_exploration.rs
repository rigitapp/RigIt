use anchor_lang::prelude::*;

use crate::state::{BlockState, ExplorationState, ExplorationStatus, ProtocolConfig};
use crate::errors::RigItError;
use crate::events::ExplorationStarted;

#[derive(Accounts)]
pub struct StartExploration<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
        constraint = !protocol_config.paused @ RigItError::ProtocolPaused,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [BlockState::SEED, &[block_state.block_id]],
        bump = block_state.bump,
        constraint = !block_state.paused @ RigItError::BlockPaused,
    )]
    pub block_state: Account<'info, BlockState>,

    #[account(
        init,
        payer = operator,
        space = ExplorationState::LEN,
        seeds = [
            ExplorationState::SEED,
            &[block_state.block_id],
            &block_state.current_exploration_index.to_le_bytes()
        ],
        bump
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

    /// Previous exploration (optional, for rollover validation)
    /// If this is the first exploration, this can be any account
    pub previous_exploration: Option<Box<Account<'info, ExplorationState>>>,

    #[account(
        mut,
        constraint = operator.key() == protocol_config.operator @ RigItError::Unauthorized
    )]
    pub operator: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<StartExploration>) -> Result<()> {
    let config = &ctx.accounts.protocol_config;
    let block = &mut ctx.accounts.block_state;
    let exploration = &mut ctx.accounts.exploration_state;
    let clock = &ctx.accounts.clock;

    // If not first exploration, verify previous is finalized
    if block.current_exploration_index > 0 {
        if let Some(prev) = &ctx.accounts.previous_exploration {
            require!(
                prev.status == ExplorationStatus::Settled || 
                prev.status == ExplorationStatus::RolledOver,
                RigItError::PreviousNotFinalized
            );
            
            // Check cooldown has ended
            require!(
                clock.unix_timestamp >= prev.cooldown_end_ts,
                RigItError::CooldownNotEnded
            );
        }
    }

    // Calculate timing
    let start_ts = clock.unix_timestamp;
    let active_end_ts = start_ts + config.active_duration_secs as i64;
    let cooldown_end_ts = active_end_ts + config.cooldown_duration_secs as i64;

    // Initialize exploration state
    exploration.block_id = block.block_id;
    exploration.exploration_index = block.current_exploration_index;
    exploration.status = ExplorationStatus::Active;
    exploration.start_slot = clock.slot;
    exploration.start_ts = start_ts;
    exploration.active_end_ts = active_end_ts;
    exploration.cooldown_end_ts = cooldown_end_ts;
    exploration.total_deposits = 0;
    exploration.rig_deposits = [0u64; 36];
    exploration.rig_tickets = [0u128; 36];
    exploration.rollover_amount = 0;
    exploration.bump = ctx.bumps.exploration_state;

    // Increment block's exploration counter for next time
    block.current_exploration_index = block
        .current_exploration_index
        .checked_add(1)
        .ok_or(RigItError::ArithmeticOverflow)?;

    // Emit event
    emit!(ExplorationStarted {
        block_id: exploration.block_id,
        exploration_index: exploration.exploration_index,
        exploration_key: exploration.key(),
        start_ts,
        active_end_ts,
        cooldown_end_ts,
        rollover_amount: exploration.rollover_amount,
    });

    msg!(
        "Exploration {} started for Block {}",
        exploration.exploration_index,
        exploration.block_id
    );

    Ok(())
}
