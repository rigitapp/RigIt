use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("RiG1tPRogRamXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod rig_it {
    use super::*;

    /// Initialize the protocol configuration
    pub fn init_protocol(ctx: Context<InitProtocol>, args: InitProtocolArgs) -> Result<()> {
        instructions::init_protocol::handler(ctx, args)
    }

    /// Initialize a new block (arena) for a specific asset
    pub fn init_block(ctx: Context<InitBlock>, args: InitBlockArgs) -> Result<()> {
        instructions::init_block::handler(ctx, args)
    }

    /// Start a new exploration round for a block
    pub fn start_exploration(ctx: Context<StartExploration>) -> Result<()> {
        instructions::start_exploration::handler(ctx)
    }

    /// Deposit tokens into a specific rig
    pub fn deposit_to_rig(ctx: Context<DepositToRig>, args: DepositToRigArgs) -> Result<()> {
        instructions::deposit_to_rig::handler(ctx, args)
    }

    /// Commit randomness for exploration finalization
    pub fn commit_randomness(
        ctx: Context<CommitRandomness>,
        args: CommitRandomnessArgs,
    ) -> Result<()> {
        instructions::commit_randomness::handler(ctx, args)
    }

    /// Reveal randomness and determine winner
    pub fn reveal_randomness(
        ctx: Context<RevealRandomness>,
        args: RevealRandomnessArgs,
    ) -> Result<()> {
        instructions::reveal_randomness::handler(ctx, args)
    }

    /// Fallback if reveal times out - uses slot hash as randomness
    pub fn reveal_timeout_fallback(ctx: Context<RevealTimeoutFallback>) -> Result<()> {
        instructions::reveal_randomness::timeout_fallback_handler(ctx)
    }

    /// Claim refund for losing deposit (50% of deposit)
    pub fn refund_loser(ctx: Context<RefundLoser>) -> Result<()> {
        instructions::refund_loser::handler(ctx)
    }

    /// Claim winnings for winning deposit
    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        instructions::claim_winnings::handler(ctx)
    }

    /// Allocate buyback budget from remaining pool
    pub fn allocate_buyback_budget(ctx: Context<AllocateBuybackBudget>) -> Result<()> {
        instructions::allocate_buyback::handler(ctx)
    }

    /// Carry forward funds from rolled-over exploration
    pub fn carry_forward(ctx: Context<CarryForward>) -> Result<()> {
        instructions::carry_forward::handler(ctx)
    }

    /// Claim anti-sniped deposit into next exploration
    pub fn claim_anti_sniped_deposit(ctx: Context<ClaimAntiSnipedDeposit>) -> Result<()> {
        instructions::deposit_to_rig::claim_anti_sniped_handler(ctx)
    }

    /// Update protocol parameters
    pub fn set_params(ctx: Context<SetParams>, args: SetParamsArgs) -> Result<()> {
        instructions::set_params::handler(ctx, args)
    }

    /// Emergency pause/unpause
    pub fn emergency_pause(ctx: Context<EmergencyPause>, pause: bool) -> Result<()> {
        instructions::emergency_pause::handler(ctx, pause)
    }
}
