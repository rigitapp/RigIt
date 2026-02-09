use anchor_lang::prelude::*;

use crate::state::{BlockState, ExplorationState, ExplorationStatus, ProtocolConfig};
use crate::errors::RigItError;
use crate::events::{ExplorationSettled, RandomnessTimeoutFallback};
use crate::utils::{
    generate_random_value, get_slot_hash, select_winning_rig, verify_reveal,
};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RevealRandomnessArgs {
    pub secret: [u8; 32],
}

#[derive(Accounts)]
pub struct RevealRandomness<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
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
        constraint = exploration_state.status == ExplorationStatus::Finalizing @ RigItError::ExplorationNotFinalizing,
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

    #[account(
        constraint = operator.key() == protocol_config.operator @ RigItError::Unauthorized
    )]
    pub operator: Signer<'info>,

    /// CHECK: SlotHashes sysvar
    #[account(address = anchor_lang::solana_program::sysvar::slot_hashes::id())]
    pub slot_hashes: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<RevealRandomness>, args: RevealRandomnessArgs) -> Result<()> {
    let block = &mut ctx.accounts.block_state;
    let exploration = &mut ctx.accounts.exploration_state;
    let clock = &ctx.accounts.clock;
    let slot_hashes_data = ctx.accounts.slot_hashes.try_borrow_data()?;

    // Verify timing - must be after commit slot but before deadline
    require!(
        clock.slot >= exploration.commit_slot,
        RigItError::RevealTooEarly
    );
    require!(
        clock.slot <= exploration.reveal_deadline_slot,
        RigItError::RevealDeadlinePassed
    );

    // Verify the reveal
    require!(
        verify_reveal(&args.secret, exploration.commit_slot, &exploration.commit_hash),
        RigItError::InvalidRevealSecret
    );

    // Get slot hash for the commit slot
    let slot_hash = get_slot_hash(&slot_hashes_data, exploration.commit_slot)
        .ok_or(RigItError::SlotHashNotAvailable)?;

    // Generate final random value
    let random_value = generate_random_value(&args.secret, &slot_hash);
    exploration.revealed_random = Some(random_value);

    // Select winning rig
    let winning_rig = select_winning_rig(&random_value, &exploration.rig_tickets)
        .ok_or(RigItError::ThresholdNotMet)?;

    exploration.winning_rig = Some(winning_rig);

    // Calculate W, L, R
    let w = exploration.rig_deposits[winning_rig as usize]
        .checked_add(exploration.rollover_amount)
        .ok_or(RigItError::ArithmeticOverflow)?;
    
    let l = exploration
        .total_deposits
        .checked_sub(exploration.rig_deposits[winning_rig as usize])
        .ok_or(RigItError::ArithmeticOverflow)?;
    
    // R = W + L/2
    let r = w
        .checked_add(l / 2)
        .ok_or(RigItError::ArithmeticOverflow)?;

    exploration.total_winner_deposits = w;
    exploration.total_loser_deposits = l;
    exploration.remaining_pool = r;
    exploration.status = ExplorationStatus::Settled;

    // Update block stats
    block.total_volume = block
        .total_volume
        .checked_add(exploration.total_deposits as u128)
        .ok_or(RigItError::ArithmeticOverflow)?;
    block.total_explorations_completed = block
        .total_explorations_completed
        .checked_add(1)
        .ok_or(RigItError::ArithmeticOverflow)?;

    emit!(ExplorationSettled {
        block_id: exploration.block_id,
        exploration_index: exploration.exploration_index,
        exploration_key: exploration.key(),
        winning_rig,
        total_pool: exploration.total_pool(),
        winner_deposits: w,
        loser_deposits: l,
        remaining_pool: r,
    });

    msg!(
        "Exploration {} settled. Winning rig: {}, W={}, L={}, R={}",
        exploration.exploration_index,
        winning_rig,
        w,
        l,
        r
    );

    Ok(())
}

// === Timeout Fallback ===

#[derive(Accounts)]
pub struct RevealTimeoutFallback<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
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
        constraint = exploration_state.status == ExplorationStatus::Finalizing @ RigItError::ExplorationNotFinalizing,
    )]
    pub exploration_state: Box<Account<'info, ExplorationState>>,

    /// Anyone can call this (permissionless)
    pub caller: Signer<'info>,

    /// CHECK: SlotHashes sysvar
    #[account(address = anchor_lang::solana_program::sysvar::slot_hashes::id())]
    pub slot_hashes: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn timeout_fallback_handler(ctx: Context<RevealTimeoutFallback>) -> Result<()> {
    let block = &mut ctx.accounts.block_state;
    let exploration = &mut ctx.accounts.exploration_state;
    let clock = &ctx.accounts.clock;
    let slot_hashes_data = ctx.accounts.slot_hashes.try_borrow_data()?;

    // Verify deadline has passed
    require!(
        clock.slot > exploration.reveal_deadline_slot,
        RigItError::RevealDeadlineNotPassed
    );

    // Use slot hash of deadline slot as randomness
    let fallback_slot = exploration.reveal_deadline_slot;
    let slot_hash = get_slot_hash(&slot_hashes_data, fallback_slot)
        .ok_or(RigItError::SlotHashNotAvailable)?;

    // Use slot hash directly as random value (no secret needed)
    let random_value = slot_hash;
    exploration.revealed_random = Some(random_value);

    // Select winning rig
    let winning_rig = select_winning_rig(&random_value, &exploration.rig_tickets)
        .ok_or(RigItError::ThresholdNotMet)?;

    exploration.winning_rig = Some(winning_rig);

    // Calculate W, L, R (same as normal reveal)
    let w = exploration.rig_deposits[winning_rig as usize]
        .checked_add(exploration.rollover_amount)
        .ok_or(RigItError::ArithmeticOverflow)?;
    
    let l = exploration
        .total_deposits
        .checked_sub(exploration.rig_deposits[winning_rig as usize])
        .ok_or(RigItError::ArithmeticOverflow)?;
    
    let r = w.checked_add(l / 2).ok_or(RigItError::ArithmeticOverflow)?;

    exploration.total_winner_deposits = w;
    exploration.total_loser_deposits = l;
    exploration.remaining_pool = r;
    exploration.status = ExplorationStatus::Settled;

    // Update block stats
    block.total_volume = block
        .total_volume
        .checked_add(exploration.total_deposits as u128)
        .ok_or(RigItError::ArithmeticOverflow)?;
    block.total_explorations_completed = block
        .total_explorations_completed
        .checked_add(1)
        .ok_or(RigItError::ArithmeticOverflow)?;

    emit!(RandomnessTimeoutFallback {
        exploration_key: exploration.key(),
        fallback_slot,
        winning_rig,
    });

    emit!(ExplorationSettled {
        block_id: exploration.block_id,
        exploration_index: exploration.exploration_index,
        exploration_key: exploration.key(),
        winning_rig,
        total_pool: exploration.total_pool(),
        winner_deposits: w,
        loser_deposits: l,
        remaining_pool: r,
    });

    msg!(
        "Exploration {} settled via timeout fallback. Winning rig: {}",
        exploration.exploration_index,
        winning_rig
    );

    Ok(())
}
