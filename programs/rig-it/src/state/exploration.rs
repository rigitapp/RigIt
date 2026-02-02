use anchor_lang::prelude::*;

/// Number of rigs per exploration
pub const RIGS_PER_EXPLORATION: usize = 36;

#[account]
pub struct ExplorationState {
    /// Parent block ID
    pub block_id: u8,
    /// Sequential exploration index
    pub exploration_index: u64,
    /// Current status
    pub status: ExplorationStatus,

    // Timing
    /// Slot when exploration was started
    pub start_slot: u64,
    /// Unix timestamp when exploration started
    pub start_ts: i64,
    /// Unix timestamp when active phase ends
    pub active_end_ts: i64,
    /// Unix timestamp when cooldown ends
    pub cooldown_end_ts: i64,

    // Deposits
    /// Total deposits across all rigs (excluding rollover)
    pub total_deposits: u64,
    /// Deposits per rig
    pub rig_deposits: [u64; RIGS_PER_EXPLORATION],
    /// Weighted ticket count per rig (u128 for precision)
    pub rig_tickets: [u128; RIGS_PER_EXPLORATION],
    /// Amount rolled over from previous exploration
    pub rollover_amount: u64,

    // Randomness (commit-reveal)
    /// Target slot for randomness reveal
    pub commit_slot: u64,
    /// Hash of (secret || target_slot)
    pub commit_hash: [u8; 32],
    /// Deadline slot for reveal (after which fallback kicks in)
    pub reveal_deadline_slot: u64,
    /// Revealed random value (set after reveal)
    pub revealed_random: Option<[u8; 32]>,

    // Result
    /// Winning rig index (0-35), None if not settled
    pub winning_rig: Option<u8>,

    // Payout tracking flags
    pub loser_refunds_processed: bool,
    pub winner_distribution_processed: bool,
    pub buyback_allocated: bool,
    pub carry_forward_done: bool,

    // Accounting (set after settlement)
    /// Total deposits in winning rig (W)
    pub total_winner_deposits: u64,
    /// Total deposits in losing rigs (L)
    pub total_loser_deposits: u64,
    /// Remaining pool after refunds: R = W + 0.5L
    pub remaining_pool: u64,

    /// PDA bump
    pub bump: u8,
}

impl Default for ExplorationState {
    fn default() -> Self {
        Self {
            block_id: 0,
            exploration_index: 0,
            status: ExplorationStatus::default(),
            start_slot: 0,
            start_ts: 0,
            active_end_ts: 0,
            cooldown_end_ts: 0,
            total_deposits: 0,
            rig_deposits: [0u64; RIGS_PER_EXPLORATION],
            rig_tickets: [0u128; RIGS_PER_EXPLORATION],
            rollover_amount: 0,
            commit_slot: 0,
            commit_hash: [0u8; 32],
            reveal_deadline_slot: 0,
            revealed_random: None,
            winning_rig: None,
            loser_refunds_processed: false,
            winner_distribution_processed: false,
            buyback_allocated: false,
            carry_forward_done: false,
            total_winner_deposits: 0,
            total_loser_deposits: 0,
            remaining_pool: 0,
            bump: 0,
        }
    }
}

impl ExplorationState {
    pub const LEN: usize = 8 + // discriminator
        1 +   // block_id
        8 +   // exploration_index
        1 +   // status
        8 +   // start_slot
        8 +   // start_ts
        8 +   // active_end_ts
        8 +   // cooldown_end_ts
        8 +   // total_deposits
        (8 * RIGS_PER_EXPLORATION) + // rig_deposits
        (16 * RIGS_PER_EXPLORATION) + // rig_tickets
        8 +   // rollover_amount
        8 +   // commit_slot
        32 +  // commit_hash
        8 +   // reveal_deadline_slot
        33 +  // revealed_random (Option<[u8;32]>)
        2 +   // winning_rig (Option<u8>)
        1 +   // loser_refunds_processed
        1 +   // winner_distribution_processed
        1 +   // buyback_allocated
        1 +   // carry_forward_done
        8 +   // total_winner_deposits
        8 +   // total_loser_deposits
        8 +   // remaining_pool
        1 +   // bump
        64;   // padding

    pub const SEED: &'static [u8] = b"exploration";

    /// Check if currently in active deposit phase
    pub fn is_active(&self, current_ts: i64) -> bool {
        self.status == ExplorationStatus::Active && current_ts < self.active_end_ts
    }

    /// Check if in anti-snipe window
    pub fn is_anti_snipe_window(&self, current_ts: i64, window_secs: u32) -> bool {
        let snipe_start = self.active_end_ts - window_secs as i64;
        current_ts >= snipe_start && current_ts < self.active_end_ts
    }

    /// Get total pool including rollover
    pub fn total_pool(&self) -> u64 {
        self.total_deposits.saturating_add(self.rollover_amount)
    }

    /// Calculate remaining pool: R = W + L/2
    pub fn calculate_remaining_pool(&self) -> u64 {
        let w = self.total_winner_deposits;
        let l = self.total_loser_deposits;
        w.saturating_add(l / 2)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum ExplorationStatus {
    #[default]
    Pending,
    Active,
    Finalizing,
    Settled,
    RolledOver,
}
