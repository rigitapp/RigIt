import { PublicKey } from '@solana/web3.js';

export interface Config {
  // Solana
  rpcUrl: string;
  wsUrl: string;
  programId: PublicKey;
  rigTokenMint: PublicKey;
  
  // Operator
  operatorPrivateKey: string;
  
  // Buyback settings
  buybackMinDelayHours: number;
  buybackMaxDelayHours: number;
  
  // Privacy Cash (stub)
  privacyCashEnabled: boolean;
  privacyCashApiUrl: string;
  
  // Block configurations
  blocks: BlockConfig[];
}

export interface BlockConfig {
  blockId: number;
  name: string;
  assetMint: PublicKey;
  minThreshold: bigint;
}

export function loadConfig(): Config {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'http://127.0.0.1:8899';
  const wsUrl = process.env.SOLANA_WS_URL || rpcUrl.replace('http', 'ws');

  return {
    rpcUrl,
    wsUrl,
    programId: new PublicKey(
      process.env.RIG_IT_PROGRAM_ID || 'RiG1tPRogRamXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    ),
    rigTokenMint: new PublicKey(
      process.env.RIG_TOKEN_MINT || 'RiGTokEnMintXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    ),
    operatorPrivateKey: process.env.OPERATOR_PRIVATE_KEY || '[]',
    buybackMinDelayHours: parseInt(process.env.BUYBACK_MIN_DELAY_HOURS || '2'),
    buybackMaxDelayHours: parseInt(process.env.BUYBACK_MAX_DELAY_HOURS || '5'),
    privacyCashEnabled: process.env.PRIVACY_CASH_ENABLED === 'true',
    privacyCashApiUrl: process.env.PRIVACY_CASH_API_URL || '',
    blocks: [
      {
        blockId: 0,
        name: 'SOL Block',
        assetMint: new PublicKey('So11111111111111111111111111111111111111112'), // Wrapped SOL
        minThreshold: BigInt(1_000_000_000), // 1 SOL
      },
      {
        blockId: 1,
        name: 'PUMP Block',
        assetMint: new PublicKey(process.env.PUMP_TOKEN_MINT || '11111111111111111111111111111111'),
        minThreshold: BigInt(100_000_000_000), // 100 PUMP (example)
      },
      {
        blockId: 2,
        name: 'SKR Block',
        assetMint: new PublicKey(process.env.SKR_TOKEN_MINT || '11111111111111111111111111111111'),
        minThreshold: BigInt(50_000_000_000), // 50 SKR (example)
      },
    ],
  };
}
