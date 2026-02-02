import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// PDA derivation helpers for tests

export function getProtocolConfigPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('protocol')],
    programId
  );
}

export function getBlockStatePDA(
  blockId: number,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('block'), Buffer.from([blockId])],
    programId
  );
}

export function getExplorationStatePDA(
  blockId: number,
  explorationIndex: BN | number,
  programId: PublicKey
): [PublicKey, number] {
  const indexBuffer = Buffer.alloc(8);
  const idx = typeof explorationIndex === 'number' 
    ? new BN(explorationIndex) 
    : explorationIndex;
  indexBuffer.writeBigUInt64LE(BigInt(idx.toString()));

  return PublicKey.findProgramAddressSync(
    [Buffer.from('exploration'), Buffer.from([blockId]), indexBuffer],
    programId
  );
}

export function getRigStatePDA(
  explorationKey: PublicKey,
  rigIndex: number,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('rig'), explorationKey.toBuffer(), Buffer.from([rigIndex])],
    programId
  );
}

export function getDepositReceiptPDA(
  rigKey: PublicKey,
  userKey: PublicKey,
  depositNonce: BN | number,
  programId: PublicKey
): [PublicKey, number] {
  const nonceBuffer = Buffer.alloc(8);
  const nonce = typeof depositNonce === 'number' 
    ? new BN(depositNonce) 
    : depositNonce;
  nonceBuffer.writeBigUInt64LE(BigInt(nonce.toString()));

  return PublicKey.findProgramAddressSync(
    [Buffer.from('deposit'), rigKey.toBuffer(), userKey.toBuffer(), nonceBuffer],
    programId
  );
}

export function getBlockVaultPDA(
  blockId: number,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('block_vault'), Buffer.from([blockId])],
    programId
  );
}

export function getBlockVaultAuthorityPDA(
  blockId: number,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('block_vault_authority'), Buffer.from([blockId])],
    programId
  );
}

export function getTreasuryVaultPDA(
  treasuryType: string,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('treasury'), Buffer.from(treasuryType)],
    programId
  );
}

// Test helpers

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateCommitHash(secret: Buffer, targetSlot: number): Buffer {
  const crypto = require('crypto');
  const slotBuffer = Buffer.alloc(8);
  slotBuffer.writeBigUInt64LE(BigInt(targetSlot));
  
  const data = Buffer.concat([secret, slotBuffer]);
  return crypto.createHash('sha256').update(data).digest();
}

export function generateRandomSecret(): Buffer {
  const crypto = require('crypto');
  return crypto.randomBytes(32);
}
