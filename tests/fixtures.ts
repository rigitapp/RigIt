import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

// Test fixtures and constants

export const TEST_CONFIG = {
  SOL_BLOCK_ID: 0,
  PUMP_BLOCK_ID: 1,
  SKR_BLOCK_ID: 2,
  MIN_THRESHOLD: new BN(1 * LAMPORTS_PER_SOL),
  MIN_DEPOSIT: new BN(0.001 * LAMPORTS_PER_SOL),
  ACTIVE_DURATION_SECS: 7200,
  COOLDOWN_DURATION_SECS: 2400,
  ANTI_SNIPE_WINDOW_SECS: 300,
};

export const PAYOUT_CONFIG = {
  WINNER_SHARE_BPS: 5000,
  BUYBACK_BURN_BPS: 1500,
  BUYBACK_LP_BPS: 1500,
  TEAM_OPS_BPS: 1000,
  ECOSYSTEM_BPS: 1000,
};

// Scenario: Multiple users deposit to various rigs
export function generateDepositScenario(userCount: number, rigsUsed: number[]): {
  users: Keypair[];
  deposits: Array<{ userIndex: number; rigIndex: number; amount: BN }>;
} {
  const users = Array.from({ length: userCount }, () => Keypair.generate());
  const deposits: Array<{ userIndex: number; rigIndex: number; amount: BN }> = [];

  for (let i = 0; i < userCount; i++) {
    const rigIndex = rigsUsed[i % rigsUsed.length];
    const amount = new BN((0.5 + Math.random() * 2) * LAMPORTS_PER_SOL);
    deposits.push({ userIndex: i, rigIndex, amount });
  }

  return { users, deposits };
}

// Calculate expected payouts for verification
export function calculateExpectedPayouts(
  deposits: Array<{ rigIndex: number; amount: BN; tickets: BN }>,
  winningRig: number
): {
  totalPool: BN;
  winnerDeposits: BN;
  loserDeposits: BN;
  remainingPool: BN;
  winnerPool: BN;
  loserRefunds: BN;
} {
  let totalPool = new BN(0);
  let winnerDeposits = new BN(0);
  let loserDeposits = new BN(0);

  for (const deposit of deposits) {
    totalPool = totalPool.add(deposit.amount);
    if (deposit.rigIndex === winningRig) {
      winnerDeposits = winnerDeposits.add(deposit.amount);
    } else {
      loserDeposits = loserDeposits.add(deposit.amount);
    }
  }

  // R = W + L/2
  const remainingPool = winnerDeposits.add(loserDeposits.divn(2));
  
  // Winner pool = 50% of R
  const winnerPool = remainingPool.divn(2);
  
  // Loser refunds = 50% of L
  const loserRefunds = loserDeposits.divn(2);

  return {
    totalPool,
    winnerDeposits,
    loserDeposits,
    remainingPool,
    winnerPool,
    loserRefunds,
  };
}

// Calculate individual winner payout
export function calculateWinnerPayout(
  userTickets: BN,
  totalRigTickets: BN,
  winnerPool: BN
): BN {
  if (totalRigTickets.isZero()) return new BN(0);
  return winnerPool.mul(userTickets).div(totalRigTickets);
}

// Generate random commit-reveal pair
export function generateCommitReveal(targetSlot: number): {
  secret: Buffer;
  commitHash: Buffer;
} {
  const crypto = require('crypto');
  const secret = crypto.randomBytes(32);
  
  const slotBuffer = Buffer.alloc(8);
  slotBuffer.writeBigUInt64LE(BigInt(targetSlot));
  
  const data = Buffer.concat([secret, slotBuffer]);
  const commitHash = crypto.createHash('sha256').update(data).digest();

  return { secret, commitHash };
}

// Simulate ticket calculation matching on-chain logic
export function calculateTickets(amount: BN, rigBalance: BN = new BN(0)): BN {
  // base_tickets = sqrt(amount)
  const baseTickets = sqrtBN(amount);
  
  // multiplier = 1 + min(sqrt(rig_balance / 1e9), 2)
  const SCALE = new BN(1_000_000);
  const RIG_BASE = new BN(1_000_000_000);
  const MAX_BONUS = new BN(2_000_000);
  
  let multiplier = SCALE;
  if (!rigBalance.isZero()) {
    const normalized = rigBalance.mul(SCALE).div(RIG_BASE);
    const sqrtBonus = sqrtBN(normalized);
    const cappedBonus = BN.min(sqrtBonus, MAX_BONUS);
    multiplier = SCALE.add(cappedBonus);
  }

  return baseTickets.mul(multiplier).div(SCALE);
}

// Integer square root for BN
function sqrtBN(n: BN): BN {
  if (n.isZero()) return new BN(0);
  if (n.eq(new BN(1))) return new BN(1);

  let x = n;
  let y = x.addn(1).divn(2);

  while (y.lt(x)) {
    x = y;
    y = x.add(n.div(x)).divn(2);
  }

  return x;
}
