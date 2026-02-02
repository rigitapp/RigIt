use anchor_lang::prelude::*;

#[event]
pub struct ExplorationStarted {
    pub block_id: u8,
    pub exploration_index: u64,
    pub exploration_key: Pubkey,
    pub start_ts: i64,
    pub active_end_ts: i64,
    pub cooldown_end_ts: i64,
    pub rollover_amount: u64,
}

#[event]
pub struct DepositMade {
    pub user: Pubkey,
    pub block_id: u8,
    pub exploration_index: u64,
    pub exploration_key: Pubkey,
    pub rig_index: u8,
    pub amount: u64,
    pub effective_tickets: u128,
    pub is_anti_sniped: bool,
    pub deposit_receipt: Pubkey,
}

#[event]
pub struct RandomnessCommitted {
    pub exploration_key: Pubkey,
    pub commit_slot: u64,
    pub reveal_deadline_slot: u64,
    pub commit_hash: [u8; 32],
}

#[event]
pub struct ExplorationSettled {
    pub block_id: u8,
    pub exploration_index: u64,
    pub exploration_key: Pubkey,
    pub winning_rig: u8,
    pub total_pool: u64,
    pub winner_deposits: u64,
    pub loser_deposits: u64,
    pub remaining_pool: u64,
}

#[event]
pub struct ExplorationRolledOver {
    pub block_id: u8,
    pub exploration_index: u64,
    pub exploration_key: Pubkey,
    pub total_deposits: u64,
    pub reason: String,
}

#[event]
pub struct LoserRefunded {
    pub user: Pubkey,
    pub exploration_key: Pubkey,
    pub deposit_receipt: Pubkey,
    pub original_amount: u64,
    pub refund_amount: u64,
}

#[event]
pub struct WinningsClaimed {
    pub user: Pubkey,
    pub exploration_key: Pubkey,
    pub deposit_receipt: Pubkey,
    pub effective_tickets: u128,
    pub winning_amount: u64,
}

#[event]
pub struct BuybackBudgetAllocated {
    pub exploration_key: Pubkey,
    pub remaining_pool: u64,
    pub burn_amount: u64,
    pub lp_amount: u64,
    pub team_amount: u64,
    pub ecosystem_amount: u64,
}

#[event]
pub struct FundsCarriedForward {
    pub from_exploration: Pubkey,
    pub to_exploration: Pubkey,
    pub amount: u64,
}

#[event]
pub struct AntiSnipedDepositClaimed {
    pub original_deposit: Pubkey,
    pub new_deposit: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub new_exploration: Pubkey,
}

#[event]
pub struct ProtocolPaused {
    pub paused_by: Pubkey,
    pub paused: bool,
    pub timestamp: i64,
}

#[event]
pub struct ParamsUpdated {
    pub updated_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct RandomnessTimeoutFallback {
    pub exploration_key: Pubkey,
    pub fallback_slot: u64,
    pub winning_rig: u8,
}
