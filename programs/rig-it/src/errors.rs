use anchor_lang::prelude::*;

#[error_code]
pub enum RigItError {
    #[msg("Protocol is paused")]
    ProtocolPaused,

    #[msg("Block is paused")]
    BlockPaused,

    #[msg("Exploration not active")]
    ExplorationNotActive,

    #[msg("Exploration not settled")]
    ExplorationNotSettled,

    #[msg("Exploration not in finalizing state")]
    ExplorationNotFinalizing,

    #[msg("Exploration already finalized")]
    ExplorationAlreadyFinalized,

    #[msg("Invalid rig index (must be 0-35)")]
    InvalidRigIndex,

    #[msg("Deposit amount too small")]
    DepositTooSmall,

    #[msg("Randomness already committed")]
    RandomnessAlreadyCommitted,

    #[msg("Commit slot must be in future")]
    CommitSlotNotFuture,

    #[msg("Reveal deadline passed")]
    RevealDeadlinePassed,

    #[msg("Reveal deadline not yet passed")]
    RevealDeadlineNotPassed,

    #[msg("Reveal too early - target slot not reached")]
    RevealTooEarly,

    #[msg("Invalid reveal secret - hash mismatch")]
    InvalidRevealSecret,

    #[msg("Refund already claimed")]
    RefundAlreadyClaimed,

    #[msg("Winnings already claimed")]
    WinningsAlreadyClaimed,

    #[msg("Not a winner - cannot claim winnings")]
    NotAWinner,

    #[msg("Not a loser - cannot claim refund")]
    NotALoser,

    #[msg("Threshold not met for draw")]
    ThresholdNotMet,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Unauthorized - invalid signer")]
    Unauthorized,

    #[msg("Previous exploration not finalized")]
    PreviousNotFinalized,

    #[msg("Buyback already allocated")]
    BuybackAlreadyAllocated,

    #[msg("Invalid fee split configuration - must sum to 10000 bps")]
    InvalidFeeSplit,

    #[msg("Block ID already exists")]
    BlockIdExists,

    #[msg("Invalid block ID")]
    InvalidBlockId,

    #[msg("Deposit is not anti-sniped")]
    DepositNotAntiSniped,

    #[msg("Deposit already rolled over")]
    DepositAlreadyRolledOver,

    #[msg("Active phase not ended")]
    ActivePhaseNotEnded,

    #[msg("Cooldown not ended")]
    CooldownNotEnded,

    #[msg("Carry forward already done")]
    CarryForwardAlreadyDone,

    #[msg("Invalid exploration status for this operation")]
    InvalidExplorationStatus,

    #[msg("No randomness revealed")]
    NoRandomnessRevealed,

    #[msg("Slot hash not available")]
    SlotHashNotAvailable,
}
