use anchor_lang::prelude::*;

use crate::state::{ExplorationState, ExplorationStatus, ProtocolConfig};
use crate::errors::RigItError;
use crate::events::FundsCarriedForward;

#[derive(Accounts)]
pub struct CarryForward<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED],
        bump = protocol_config.bump,
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    /// The rolled-over exploration (source of funds)
    #[account(
        mut,
        constraint = rolled_exploration.status == ExplorationStatus::RolledOver @ RigItError::InvalidExplorationStatus,
        constraint = !rolled_exploration.carry_forward_done @ RigItError::CarryForwardAlreadyDone,
    )]
    pub rolled_exploration: Box<Account<'info, ExplorationState>>,

    /// The next exploration to receive the funds
    #[account(
        mut,
        constraint = next_exploration.block_id == rolled_exploration.block_id,
        constraint = next_exploration.exploration_index == rolled_exploration.exploration_index + 1,
        constraint = next_exploration.status == ExplorationStatus::Active @ RigItError::ExplorationNotActive,
    )]
    pub next_exploration: Box<Account<'info, ExplorationState>>,

    #[account(
        constraint = operator.key() == protocol_config.operator @ RigItError::Unauthorized
    )]
    pub operator: Signer<'info>,
}

pub fn handler(ctx: Context<CarryForward>) -> Result<()> {
    let rolled = &mut ctx.accounts.rolled_exploration;
    let next = &mut ctx.accounts.next_exploration;

    // Amount to carry forward is the total deposits from rolled exploration
    let carry_amount = rolled.total_deposits;

    // Add to next exploration's rollover amount
    next.rollover_amount = next
        .rollover_amount
        .checked_add(carry_amount)
        .ok_or(RigItError::ArithmeticOverflow)?;

    // Mark as done
    rolled.carry_forward_done = true;

    emit!(FundsCarriedForward {
        from_exploration: rolled.key(),
        to_exploration: next.key(),
        amount: carry_amount,
    });

    msg!(
        "Carried forward {} from exploration {} to {}",
        carry_amount,
        rolled.exploration_index,
        next.exploration_index
    );

    Ok(())
}
