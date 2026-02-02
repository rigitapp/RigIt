import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// === Account Types ===

export interface ProtocolConfig {
  admin: PublicKey;
  operator: PublicKey;
  rigTokenMint: PublicKey;
  emergencyAdmin: PublicKey;
  paused: boolean;
  winnerShareBps: number;
  buybackBurnBps: number;
  buybackLpBps: number;
  teamOpsBps: number;
  ecosystemBps: number;
  activeDurationSecs: number;
  cooldownDurationSecs: number;
  antiSnipeWindowSecs: number;
  commitRevealTimeoutSlots: BN;
  bump: number;
}

export interface BlockState {
  blockId: number;
  assetMint: PublicKey;
  assetDecimals: number;
  minThreshold: BN;
  currentExplorationIndex: BN;
  paused: boolean;
  totalVolume: BN;
  totalExplorationsCompleted: BN;
  bump: number;
}

export enum ExplorationStatus {
  Pending = 'pending',
  Active = 'active',
  Finalizing = 'finalizing',
  Settled = 'settled',
  RolledOver = 'rolledOver',
}

export interface ExplorationState {
  blockId: number;
  explorationIndex: BN;
  status: ExplorationStatus;
  startSlot: BN;
  startTs: BN;
  activeEndTs: BN;
  cooldownEndTs: BN;
  totalDeposits: BN;
  rigDeposits: BN[];
  rigTickets: BN[];
  rolloverAmount: BN;
  commitSlot: BN;
  commitHash: Uint8Array;
  revealDeadlineSlot: BN;
  revealedRandom: Uint8Array | null;
  winningRig: number | null;
  loserRefundsProcessed: boolean;
  winnerDistributionProcessed: boolean;
  buybackAllocated: boolean;
  carryForwardDone: boolean;
  totalWinnerDeposits: BN;
  totalLoserDeposits: BN;
  remainingPool: BN;
  bump: number;
}

export interface RigState {
  exploration: PublicKey;
  rigIndex: number;
  totalDeposits: BN;
  totalTickets: BN;
  depositCount: number;
  bump: number;
}

export interface DepositReceipt {
  user: PublicKey;
  rig: PublicKey;
  exploration: PublicKey;
  amount: BN;
  effectiveTickets: BN;
  depositedAt: BN;
  depositNonce: BN;
  isAntiSniped: boolean;
  rolledToExploration: PublicKey | null;
  refundClaimed: boolean;
  winningsClaimed: boolean;
  bump: number;
}

// === Instruction Args ===

export interface InitProtocolArgs {
  operator: PublicKey;
  emergencyAdmin: PublicKey;
}

export interface InitBlockArgs {
  blockId: number;
  minThreshold: BN;
}

export interface DepositToRigArgs {
  rigIndex: number;
  amount: BN;
  depositNonce: BN;
}

export interface CommitRandomnessArgs {
  commitHash: Uint8Array;
  targetSlot: BN;
}

export interface RevealRandomnessArgs {
  secret: Uint8Array;
}

export interface SetParamsArgs {
  activeDurationSecs?: number;
  cooldownDurationSecs?: number;
  antiSnipeWindowSecs?: number;
  commitRevealTimeoutSlots?: BN;
  newOperator?: PublicKey;
  newEmergencyAdmin?: PublicKey;
}

// === Event Types ===

export interface ExplorationStartedEvent {
  blockId: number;
  explorationIndex: BN;
  explorationKey: PublicKey;
  startTs: BN;
  activeEndTs: BN;
  cooldownEndTs: BN;
  rolloverAmount: BN;
}

export interface DepositMadeEvent {
  user: PublicKey;
  blockId: number;
  explorationIndex: BN;
  explorationKey: PublicKey;
  rigIndex: number;
  amount: BN;
  effectiveTickets: BN;
  isAntiSniped: boolean;
  depositReceipt: PublicKey;
}

export interface ExplorationSettledEvent {
  blockId: number;
  explorationIndex: BN;
  explorationKey: PublicKey;
  winningRig: number;
  totalPool: BN;
  winnerDeposits: BN;
  loserDeposits: BN;
  remainingPool: BN;
}

// === Constants ===

export const RIGS_PER_EXPLORATION = 36;

export const BLOCK_IDS = {
  SOL: 0,
  PUMP: 1,
  SKR: 2,
} as const;

export type BlockId = typeof BLOCK_IDS[keyof typeof BLOCK_IDS];
