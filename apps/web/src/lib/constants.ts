import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'RiG1tPRogRamXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
);

export const RIG_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_RIG_TOKEN_MINT || 'RiGTokEnMintXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
);

export const BLOCK_NAMES: Record<number, string> = {
  0: 'SOL Block',
  1: 'PUMP Block',
  2: 'SKR Block',
};

export const BLOCK_SYMBOLS: Record<number, string> = {
  0: 'SOL',
  1: 'PUMP',
  2: 'SKR',
};

export const TIMING = {
  ACTIVE_DURATION_SECS: 7200,
  COOLDOWN_DURATION_SECS: 2400,
  ANTI_SNIPE_WINDOW_SECS: 300,
  EXPLORATIONS_PER_DAY: 9,
};

export const PAYOUT_SPLITS = {
  WINNER_SHARE_BPS: 5000,      // 50%
  BUYBACK_BURN_BPS: 1500,      // 15%
  BUYBACK_LP_BPS: 1500,        // 15%
  TEAM_OPS_BPS: 1000,          // 10%
  ECOSYSTEM_BPS: 1000,         // 10%
  LOSER_REFUND_PERCENT: 50,    // 50% of deposit
};
