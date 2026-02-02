use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct DepositReceipt {
    /// Depositor's wallet
    pub user: Pubkey,
    /// Rig account this deposit belongs to
    pub rig: Pubkey,
    /// Rig index (0-35) for quick lookup and rollover
    pub rig_index: u8,
    /// Exploration account
    pub exploration: Pubkey,
    /// Deposit amount in token units
    pub amount: u64,
    /// Effective ticket weight (after sqrt + $RIG multiplier)
    pub effective_tickets: u128,
    /// Unix timestamp of deposit
    pub deposited_at: i64,
    /// Nonce for unique PDA derivation (allows multiple deposits per user per rig)
    pub deposit_nonce: u64,

    // Anti-snipe handling
    /// Was this deposit made in anti-snipe window?
    pub is_anti_sniped: bool,
    /// If anti-sniped, where was it rolled to?
    pub rolled_to_exploration: Option<Pubkey>,

    // Claim tracking
    /// Has loser refund been claimed?
    pub refund_claimed: bool,
    /// Has winner payout been claimed?
    pub winnings_claimed: bool,

    /// PDA bump
    pub bump: u8,
}

impl DepositReceipt {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        32 + // rig
        1 +  // rig_index
        32 + // exploration
        8 +  // amount
        16 + // effective_tickets
        8 +  // deposited_at
        8 +  // deposit_nonce
        1 +  // is_anti_sniped
        33 + // rolled_to_exploration (Option<Pubkey>)
        1 +  // refund_claimed
        1 +  // winnings_claimed
        1 +  // bump
        32;  // padding

    pub const SEED: &'static [u8] = b"deposit";
}

#[account]
#[derive(Default)]
pub struct UserStats {
    /// User's wallet
    pub user: Pubkey,
    /// Total deposits made (u128 for overflow)
    pub total_deposits: u128,
    /// Total explorations won
    pub total_wins: u64,
    /// Total winnings received
    pub total_winnings: u128,
    /// Total refunds received
    pub total_refunds: u128,
    /// Last known $RIG balance snapshot
    pub rig_balance_snapshot: u64,
    /// PDA bump
    pub bump: u8,
}

impl UserStats {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        16 + // total_deposits
        8 +  // total_wins
        16 + // total_winnings
        16 + // total_refunds
        8 +  // rig_balance_snapshot
        1 +  // bump
        32;  // padding

    pub const SEED: &'static [u8] = b"user_stats";
}
