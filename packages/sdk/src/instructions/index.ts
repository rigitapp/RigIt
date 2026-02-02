// Instruction builders for direct transaction construction
// These are lower-level than the client methods and useful for
// building complex transactions or batching

import { PublicKey, TransactionInstruction, SystemProgram, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

import {
  getProtocolConfigPDA,
  getBlockStatePDA,
  getExplorationStatePDA,
  getRigStatePDA,
  getDepositReceiptPDA,
  getBlockVaultPDA,
  getBlockVaultAuthorityPDA,
  PROGRAM_ID,
} from '../pdas';

// For MVP, instruction builders would be implemented here
// In practice, you'd use the Anchor-generated instruction builders

export interface DepositToRigAccounts {
  protocolConfig: PublicKey;
  blockState: PublicKey;
  explorationState: PublicKey;
  rigState: PublicKey;
  depositReceipt: PublicKey;
  user: PublicKey;
  userTokenAccount: PublicKey;
  blockVault: PublicKey;
  userRigTokenAccount?: PublicKey;
  rigTokenMint?: PublicKey;
}

export function deriveDepositAccounts(
  blockId: number,
  explorationIndex: BN,
  rigIndex: number,
  user: PublicKey,
  depositNonce: BN,
  programId: PublicKey = PROGRAM_ID
): {
  explorationState: PublicKey;
  rigState: PublicKey;
  depositReceipt: PublicKey;
  blockVault: PublicKey;
  blockVaultAuthority: PublicKey;
} {
  const [explorationState] = getExplorationStatePDA(blockId, explorationIndex, programId);
  const [rigState] = getRigStatePDA(explorationState, rigIndex, programId);
  const [depositReceipt] = getDepositReceiptPDA(rigState, user, depositNonce, programId);
  const [blockVault] = getBlockVaultPDA(blockId, programId);
  const [blockVaultAuthority] = getBlockVaultAuthorityPDA(blockId, programId);

  return {
    explorationState,
    rigState,
    depositReceipt,
    blockVault,
    blockVaultAuthority,
  };
}

export function deriveAllRigPDAs(
  explorationKey: PublicKey,
  programId: PublicKey = PROGRAM_ID
): PublicKey[] {
  const rigs: PublicKey[] = [];
  for (let i = 0; i < 36; i++) {
    const [rigPda] = getRigStatePDA(explorationKey, i, programId);
    rigs.push(rigPda);
  }
  return rigs;
}
