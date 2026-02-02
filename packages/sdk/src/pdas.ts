import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// Default program ID - replace after deployment
export const PROGRAM_ID = new PublicKey('RiG1tPRogRamXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

export const SEEDS = {
  PROTOCOL: Buffer.from('protocol'),
  BLOCK: Buffer.from('block'),
  EXPLORATION: Buffer.from('exploration'),
  RIG: Buffer.from('rig'),
  DEPOSIT: Buffer.from('deposit'),
  BLOCK_VAULT: Buffer.from('block_vault'),
  BLOCK_VAULT_AUTHORITY: Buffer.from('block_vault_authority'),
  TREASURY: Buffer.from('treasury'),
  USER_STATS: Buffer.from('user_stats'),
};

export function getProtocolConfigPDA(programId: PublicKey = PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.PROTOCOL],
    programId
  );
}

export function getBlockStatePDA(
  blockId: number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.BLOCK, Buffer.from([blockId])],
    programId
  );
}

export function getExplorationStatePDA(
  blockId: number,
  explorationIndex: BN | number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  const indexBuffer = Buffer.alloc(8);
  const idx = typeof explorationIndex === 'number' ? new BN(explorationIndex) : explorationIndex;
  indexBuffer.writeBigUInt64LE(BigInt(idx.toString()));
  
  return PublicKey.findProgramAddressSync(
    [SEEDS.EXPLORATION, Buffer.from([blockId]), indexBuffer],
    programId
  );
}

export function getRigStatePDA(
  explorationKey: PublicKey,
  rigIndex: number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.RIG, explorationKey.toBuffer(), Buffer.from([rigIndex])],
    programId
  );
}

export function getDepositReceiptPDA(
  rigKey: PublicKey,
  userKey: PublicKey,
  depositNonce: BN | number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  const nonceBuffer = Buffer.alloc(8);
  const nonce = typeof depositNonce === 'number' ? new BN(depositNonce) : depositNonce;
  nonceBuffer.writeBigUInt64LE(BigInt(nonce.toString()));
  
  return PublicKey.findProgramAddressSync(
    [SEEDS.DEPOSIT, rigKey.toBuffer(), userKey.toBuffer(), nonceBuffer],
    programId
  );
}

export function getBlockVaultPDA(
  blockId: number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.BLOCK_VAULT, Buffer.from([blockId])],
    programId
  );
}

export function getBlockVaultAuthorityPDA(
  blockId: number,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.BLOCK_VAULT_AUTHORITY, Buffer.from([blockId])],
    programId
  );
}

export function getTreasuryVaultPDA(
  treasuryType: 'buyback_burn' | 'buyback_lp' | 'team_ops' | 'ecosystem',
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.TREASURY, Buffer.from(treasuryType)],
    programId
  );
}

export function getUserStatsPDA(
  userKey: PublicKey,
  programId: PublicKey = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.USER_STATS, userKey.toBuffer()],
    programId
  );
}
