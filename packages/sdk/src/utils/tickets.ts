/**
 * Ticket calculation utilities
 * Must match on-chain logic exactly
 */

const SCALE = 1_000_000n;
const RIG_MULTIPLIER_BASE = 1_000_000_000n; // 1 RIG with 9 decimals
const MAX_MULTIPLIER_BONUS = 2_000_000n;

/**
 * Integer square root using Newton's method
 */
export function integerSqrt(n: bigint): bigint {
  if (n === 0n) return 0n;
  if (n === 1n) return 1n;

  let x = n;
  let y = (x + 1n) / 2n;

  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }

  return x;
}

/**
 * Calculate base tickets from deposit amount
 * Formula: sqrt(amount) * SCALE / sqrt(SCALE)
 * 
 * This gives sublinear scaling:
 * - 0.001 SOL (1e6 lamports) → ~1000 tickets
 * - 0.01 SOL (1e7 lamports) → ~3162 tickets
 * - 0.1 SOL (1e8 lamports) → ~10000 tickets
 * - 1 SOL (1e9 lamports) → ~31623 tickets
 */
export function calculateBaseTickets(amount: number | bigint): bigint {
  const amountBigInt = BigInt(amount);
  if (amountBigInt === 0n) return 0n;

  const scaled = amountBigInt * SCALE;
  return integerSqrt(scaled);
}

/**
 * Calculate $RIG holding multiplier
 * Formula: 1 + min(sqrt(rig_balance / 1e9), 2)
 * Returns multiplier scaled by SCALE (1e6)
 * Range: 1.0x (1e6) to 3.0x (3e6)
 */
export function calculateRigMultiplier(rigBalance: number | bigint): bigint {
  const base = SCALE;
  const balanceBigInt = BigInt(rigBalance);

  if (balanceBigInt === 0n) return base;

  const normalized = (balanceBigInt * SCALE) / RIG_MULTIPLIER_BASE;
  const sqrtBonus = integerSqrt(normalized);
  const cappedBonus = sqrtBonus < MAX_MULTIPLIER_BONUS ? sqrtBonus : MAX_MULTIPLIER_BONUS;

  return base + cappedBonus;
}

/**
 * Calculate effective tickets with $RIG multiplier applied
 */
export function calculateEffectiveTickets(
  depositAmount: number | bigint,
  rigBalance: number | bigint
): bigint {
  const base = calculateBaseTickets(depositAmount);
  const multiplier = calculateRigMultiplier(rigBalance);

  return (base * multiplier) / SCALE;
}

/**
 * Calculate user's share of winner pool
 * @param userTickets User's effective tickets in winning rig
 * @param totalRigTickets Total tickets in winning rig
 * @param remainingPool R value from settlement
 * @param winnerShareBps Winner share in basis points (default 5000 = 50%)
 */
export function calculateWinnerShare(
  userTickets: bigint,
  totalRigTickets: bigint,
  remainingPool: bigint,
  winnerShareBps: number = 5000
): bigint {
  if (totalRigTickets === 0n) return 0n;

  const winnerPool = (remainingPool * BigInt(winnerShareBps)) / 10000n;
  return (winnerPool * userTickets) / totalRigTickets;
}

/**
 * Calculate loser refund (always 50% of deposit)
 */
export function calculateLoserRefund(depositAmount: number | bigint): bigint {
  return BigInt(depositAmount) / 2n;
}

/**
 * Estimate ticket weight for UI display
 */
export function estimateTicketWeight(
  depositAmount: number,
  rigBalance: number = 0
): {
  baseTickets: number;
  multiplier: number;
  effectiveTickets: number;
} {
  const baseTickets = Number(calculateBaseTickets(depositAmount));
  const multiplierScaled = Number(calculateRigMultiplier(rigBalance));
  const multiplier = multiplierScaled / 1_000_000;
  const effectiveTickets = Number(calculateEffectiveTickets(depositAmount, rigBalance));

  return {
    baseTickets,
    multiplier,
    effectiveTickets,
  };
}
