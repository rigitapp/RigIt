import { PublicKey } from "@solana/web3.js";

// Program ID — deployed to devnet
export const PROGRAM_ID = new PublicKey(
  "CPHYypjTxBkMCpXAxQAXPQkA4AMKZXyTRXhhSDPBzzDo"
);

// RPC endpoint — defaults to devnet, override via env
export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.devnet.solana.com";

// Block IDs (must match on-chain program constants)
export const BLOCK_IDS = {
  SOL: 0,
  PUMP: 1,
  SKR: 2,
} as const;

export type BlockSymbol = keyof typeof BLOCK_IDS;

// 36 rigs per exploration (matches on-chain RIGS_PER_EXPLORATION)
export const RIGS_PER_EXPLORATION = 36;

// Timing defaults (seconds) — matches ProtocolConfig::init_defaults
export const ACTIVE_DURATION_SECS = 7200; // 2 hours
export const COOLDOWN_DURATION_SECS = 2400; // 40 minutes
export const ANTI_SNIPE_WINDOW_SECS = 300; // 5 minutes
export const EXPLORATIONS_PER_DAY = 9;

// Fee splits in basis points (matches on-chain defaults)
export const FEE_SPLITS = {
  winnerShareBps: 5000, // 50% to winners
  buybackBurnBps: 1500, // 15% buyback + burn
  buybackLpBps: 1500, // 15% buyback + LP
  teamOpsBps: 1000, // 10% team ops
  ecosystemBps: 1000, // 10% ecosystem
} as const;
