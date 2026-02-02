use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct RigState {
    /// Parent exploration account
    pub exploration: Pubkey,
    /// Rig index (0-35)
    pub rig_index: u8,
    /// Total deposits in this rig
    pub total_deposits: u64,
    /// Total weighted tickets in this rig
    pub total_tickets: u128,
    /// Number of individual deposits
    pub deposit_count: u32,
    /// PDA bump
    pub bump: u8,
}

impl RigState {
    pub const LEN: usize = 8 + // discriminator
        32 + // exploration
        1 +  // rig_index
        8 +  // total_deposits
        16 + // total_tickets
        4 +  // deposit_count
        1 +  // bump
        32;  // padding

    pub const SEED: &'static [u8] = b"rig";
}
