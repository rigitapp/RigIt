use anchor_lang::prelude::*;

use crate::state::{BlockState, ExplorationState, ExplorationStatus, ProtocolConfig};
use crate::errors::RigItError;
use crate::events::{ExplorationRolledOver, RandomnessCommitted};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CommitRandomnessArgs {
    pub commit_hash: [u8; 32],
    pub target_slot: u64,
}

#[derive(Accounts)]
pub struct CommitRandomness<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        seeds = [BlockState::SEED, &[block_state.block_id]],
        bump = block_state.bump,
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
        constraint = exploration_state.status == ExplorationStatus::Active @ RigItError::InvalidExplorationStatus,
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

    #[account(
        constraint = operator.key() == protocol_config.operator @ RigItError::Unauthorized
    )]
    pub operator: Signer<'info>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<CommitRandomness>, args: CommitRandomnessArgs) -> Result<()> {
    let config = &ctx.accounts.protocol_config;
    let block = &ctx.accounts.block_state;
    let exploration = &mut ctx.accounts.exploration_state;
    let clock = &ctx.accounts.clock;

    // Verify active phase has ended
    require!(
        clock.unix_timestamp >= exploration.active_end_ts,
        RigItError::ActivePhaseNotEnded
    );

    // Check threshold including rollover
    let total_pool = exploration.total_pool();

    if total_pool < block.min_threshold {
        // Threshold not met - rollover
        exploration.status = ExplorationStatus::RolledOver;

        emit!(ExplorationRolledOver {
            block_id: exploration.block_id,
            exploration_index: exploration.exploration_index,
            exploration_key: exploration.key(),
            total_deposits: exploration.total_deposits,
            reason: "Threshold not met".to_string(),
        });

        msg!(
            "Exploration {} rolled over - threshold not met ({} < {})",
            exploration.exploration_index,
            total_pool,
            block.min_threshold
        );

        return Ok(());
    }

    // Verify target slot is in the future
    let min_future_slot = clock.slot + 10; // At least 10 slots ahead
    require!(
        args.target_slot >= min_future_slot,
        RigItError::CommitSlotNotFuture
    );

    // Set commit state
    exploration.commit_slot = args.target_slot;
    exploration.commit_hash = args.commit_hash;
    exploration.reveal_deadline_slot = args.target_slot + config.commit_reveal_timeout_slots;
    exploration.status = ExplorationStatus::Finalizing;

    emit!(RandomnessCommitted {
        exploration_key: exploration.key(),
        commit_slot: exploration.commit_slot,
        reveal_deadline_slot: exploration.reveal_deadline_slot,
        commit_hash: exploration.commit_hash,
    });

    msg!(
        "Randomness committed for exploration {}. Target slot: {}, deadline: {}",
        exploration.exploration_index,
        exploration.commit_slot,
        exploration.reveal_deadline_slot
    );

    Ok(())
}
