use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct BlockState {
    /// Block identifier (0 = SOL, 1 = PUMP, 2 = SKR)
    pub block_id: u8,
    /// Asset token mint (or NATIVE_MINT for wrapped SOL)
    pub asset_mint: Pubkey,
    /// Asset decimals for display
    pub asset_decimals: u8,
    /// Minimum pool threshold for draw to occur
    pub min_threshold: u64,
    /// Current exploration index (increments each exploration)
    pub current_exploration_index: u64,
    /// Block-specific pause state
    pub paused: bool,
    /// Total volume deposited through this block (u128 for overflow safety)
    pub total_volume: u128,
    /// Total explorations that reached settlement
    pub total_explorations_completed: u64,
    /// PDA bump
    pub bump: u8,
}

impl BlockState {
    pub const LEN: usize = 8 + // discriminator
        1 +  // block_id
        32 + // asset_mint
        1 +  // asset_decimals
        8 +  // min_threshold
        8 +  // current_exploration_index
        1 +  // paused
        16 + // total_volume
        8 +  // total_explorations_completed
        1 +  // bump
        64;  // padding

    pub const SEED: &'static [u8] = b"block";

    /// Returns the seeds for this block's PDA.
    /// The caller must pass in a buffer to hold the block_id byte.
    pub fn seeds_with_bump<'a>(&self, block_id_buf: &'a mut [u8; 1], bump: &'a [u8; 1]) -> [&'a [u8]; 3] {
        block_id_buf[0] = self.block_id;
        [Self::SEED, block_id_buf, bump]
    }
}

/// Block identifiers
pub mod block_ids {
    pub const SOL_BLOCK: u8 = 0;
    pub const PUMP_BLOCK: u8 = 1;
    pub const SKR_BLOCK: u8 = 2;
}
