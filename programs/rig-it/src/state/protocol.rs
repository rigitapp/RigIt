use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ProtocolConfig {
    /// Admin with full control
    pub admin: Pubkey,
    /// Operator that can call finalize, buyback, etc.
    pub operator: Pubkey,
    /// $RIG token mint address
    pub rig_token_mint: Pubkey,
    /// Emergency admin for pause only
    pub emergency_admin: Pubkey,
    /// Protocol paused state
    pub paused: bool,

    // Fee splits in basis points (must sum to 10000)
    /// Winner share: 50% = 5000 bps
    pub winner_share_bps: u16,
    /// Buyback + burn: 15% = 1500 bps
    pub buyback_burn_bps: u16,
    /// Buyback + LP lock: 15% = 1500 bps
    pub buyback_lp_bps: u16,
    /// Team operations: 10% = 1000 bps
    pub team_ops_bps: u16,
    /// Ecosystem/retention: 10% = 1000 bps
    pub ecosystem_bps: u16,

    // Timing configuration
    /// Active exploration duration in seconds (default: 7200 = 2 hours)
    pub active_duration_secs: u32,
    /// Cooldown duration in seconds (default: 2400 = 40 minutes)
    pub cooldown_duration_secs: u32,
    /// Anti-snipe window in seconds (default: 300 = 5 minutes)
    pub anti_snipe_window_secs: u32,

    // Randomness configuration
    /// Timeout slots for commit-reveal (default: ~150 slots = ~1 minute)
    pub commit_reveal_timeout_slots: u64,

    /// PDA bump
    pub bump: u8,
}

impl ProtocolConfig {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // operator
        32 + // rig_token_mint
        32 + // emergency_admin
        1 +  // paused
        2 +  // winner_share_bps
        2 +  // buyback_burn_bps
        2 +  // buyback_lp_bps
        2 +  // team_ops_bps
        2 +  // ecosystem_bps
        4 +  // active_duration_secs
        4 +  // cooldown_duration_secs
        4 +  // anti_snipe_window_secs
        8 +  // commit_reveal_timeout_slots
        1 +  // bump
        64;  // padding for future fields

    pub const SEED: &'static [u8] = b"protocol";

    /// Validate fee splits sum to 10000 bps (100%)
    pub fn validate_fee_splits(&self) -> bool {
        let total = self.winner_share_bps as u32
            + self.buyback_burn_bps as u32
            + self.buyback_lp_bps as u32
            + self.team_ops_bps as u32
            + self.ecosystem_bps as u32;
        total == 10000
    }

    /// Initialize with default values
    pub fn init_defaults(&mut self) {
        self.winner_share_bps = 5000;
        self.buyback_burn_bps = 1500;
        self.buyback_lp_bps = 1500;
        self.team_ops_bps = 1000;
        self.ecosystem_bps = 1000;
        self.active_duration_secs = 7200;
        self.cooldown_duration_secs = 2400;
        self.anti_snipe_window_secs = 300;
        self.commit_reveal_timeout_slots = 150;
    }
}
