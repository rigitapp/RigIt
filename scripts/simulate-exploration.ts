/**
 * Simulate a complete exploration cycle for testing
 * 
 * Usage:
 *   npx ts-node scripts/simulate-exploration.ts start
 *   npx ts-node scripts/simulate-exploration.ts deposit
 *   npx ts-node scripts/simulate-exploration.ts finalize
 *   npx ts-node scripts/simulate-exploration.ts claim
 */

import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface LocalConfig {
  programId: string;
  operatorSecretKey: number[];
  solTokenMint: string;
  protocolConfig: string;
  blocks: {
    sol: {
      blockId: number;
      blockState: string;
      blockVault: string;
      assetMint: string;
    };
  };
}

async function loadConfig(): Promise<LocalConfig> {
  const configPath = path.join(__dirname, '../.local-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Local config not found. Run init-local.ts first.');
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

async function startExploration() {
  console.log('🚀 Starting new exploration...\n');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const config = await loadConfig();
  const programId = new PublicKey(config.programId);
  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../target/idl/rig_it.json'), 'utf8')
  );
  const program = new Program(idl, programId, provider);

  const operator = Keypair.fromSecretKey(Uint8Array.from(config.operatorSecretKey));
  const protocolConfigPDA = new PublicKey(config.protocolConfig);
  const blockStatePDA = new PublicKey(config.blocks.sol.blockState);

  // Get current exploration index
  const block = await program.account.blockState.fetch(blockStatePDA);
  const explorationIndex = block.currentExplorationIndex;

  console.log('Current exploration index:', explorationIndex.toString());

  // Derive exploration PDA
  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigUInt64LE(BigInt(explorationIndex.toString()));
  const [explorationPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('exploration'), Buffer.from([config.blocks.sol.blockId]), indexBuffer],
    programId
  );

  await program.methods
    .startExploration()
    .accounts({
      protocolConfig: protocolConfigPDA,
      blockState: blockStatePDA,
      explorationState: explorationPDA,
      previousExploration: null,
      operator: operator.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    })
    .signers([operator])
    .rpc();

  console.log('✅ Exploration started!');
  console.log('   PDA:', explorationPDA.toBase58());
  console.log('   Index:', explorationIndex.toString());
}

async function makeDeposits() {
  console.log('💰 Making test deposits...\n');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const config = await loadConfig();
  const programId = new PublicKey(config.programId);
  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../target/idl/rig_it.json'), 'utf8')
  );
  const program = new Program(idl, programId, provider);

  const protocolConfigPDA = new PublicKey(config.protocolConfig);
  const blockStatePDA = new PublicKey(config.blocks.sol.blockState);
  const solTokenMint = new PublicKey(config.blocks.sol.assetMint);
  const blockVault = new PublicKey(config.blocks.sol.blockVault);

  // Get current exploration
  const block = await program.account.blockState.fetch(blockStatePDA);
  const explorationIndex = block.currentExplorationIndex.subn(1);

  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigUInt64LE(BigInt(explorationIndex.toString()));
  const [explorationPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('exploration'), Buffer.from([config.blocks.sol.blockId]), indexBuffer],
    programId
  );

  // Create test users and deposit
  const numUsers = 5;
  const rigs = [3, 7, 12, 17, 25]; // Different rigs

  for (let i = 0; i < numUsers; i++) {
    const user = Keypair.generate();
    
    // Airdrop SOL
    const airdropSig = await provider.connection.requestAirdrop(
      user.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    // Create token account
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      (provider.wallet as any).payer,
      solTokenMint,
      user.publicKey
    );

    // Mint tokens
    await mintTo(
      provider.connection,
      (provider.wallet as any).payer,
      solTokenMint,
      userTokenAccount.address,
      provider.wallet.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    // Deposit to rig
    const rigIndex = rigs[i];
    const amount = new BN((0.5 + Math.random()) * LAMPORTS_PER_SOL);
    const depositNonce = new BN(Date.now() + i);

    const [rigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('rig'), explorationPDA.toBuffer(), Buffer.from([rigIndex])],
      programId
    );

    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigUInt64LE(BigInt(depositNonce.toString()));
    const [depositReceiptPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('deposit'), rigPDA.toBuffer(), user.publicKey.toBuffer(), nonceBuffer],
      programId
    );

    await program.methods
      .depositToRig({
        rigIndex,
        amount,
        depositNonce,
      })
      .accounts({
        protocolConfig: protocolConfigPDA,
        blockState: blockStatePDA,
        explorationState: explorationPDA,
        rigState: rigPDA,
        depositReceipt: depositReceiptPDA,
        user: user.publicKey,
        userTokenAccount: userTokenAccount.address,
        blockVault,
        userRigTokenAccount: null,
        rigTokenMint: null,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([user])
      .rpc();

    console.log(`✅ User ${i + 1} deposited ${(amount.toNumber() / LAMPORTS_PER_SOL).toFixed(4)} SOL to rig ${rigIndex}`);
  }

  // Print summary
  const exploration = await program.account.explorationState.fetch(explorationPDA);
  console.log('\n📊 Exploration Summary:');
  console.log('   Total deposits:', (exploration.totalDeposits.toNumber() / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
}

async function finalizeExploration() {
  console.log('🎲 Finalizing exploration...\n');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const config = await loadConfig();
  const programId = new PublicKey(config.programId);
  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../target/idl/rig_it.json'), 'utf8')
  );
  const program = new Program(idl, programId, provider);

  const operator = Keypair.fromSecretKey(Uint8Array.from(config.operatorSecretKey));
  const protocolConfigPDA = new PublicKey(config.protocolConfig);
  const blockStatePDA = new PublicKey(config.blocks.sol.blockState);

  // Get current exploration
  const block = await program.account.blockState.fetch(blockStatePDA);
  const explorationIndex = block.currentExplorationIndex.subn(1);

  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigUInt64LE(BigInt(explorationIndex.toString()));
  const [explorationPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('exploration'), Buffer.from([config.blocks.sol.blockId]), indexBuffer],
    programId
  );

  // Step 1: Commit randomness
  console.log('Step 1: Committing randomness...');
  const secret = crypto.randomBytes(32);
  const currentSlot = await provider.connection.getSlot();
  const targetSlot = currentSlot + 15;

  const slotBuffer = Buffer.alloc(8);
  slotBuffer.writeBigUInt64LE(BigInt(targetSlot));
  const commitHash = crypto.createHash('sha256')
    .update(Buffer.concat([secret, slotBuffer]))
    .digest();

  await program.methods
    .commitRandomness({
      commitHash: Array.from(commitHash),
      targetSlot: new BN(targetSlot),
    })
    .accounts({
      protocolConfig: protocolConfigPDA,
      blockState: blockStatePDA,
      explorationState: explorationPDA,
      operator: operator.publicKey,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    })
    .signers([operator])
    .rpc();

  console.log('✅ Randomness committed. Target slot:', targetSlot);

  // Wait for target slot
  console.log('⏳ Waiting for target slot...');
  let slot = await provider.connection.getSlot();
  while (slot < targetSlot) {
    await new Promise(resolve => setTimeout(resolve, 400));
    slot = await provider.connection.getSlot();
  }

  // Step 2: Reveal randomness
  console.log('Step 2: Revealing randomness...');
  await program.methods
    .revealRandomness({
      secret: Array.from(secret),
    })
    .accounts({
      protocolConfig: protocolConfigPDA,
      blockState: blockStatePDA,
      explorationState: explorationPDA,
      operator: operator.publicKey,
      slotHashes: anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    })
    .signers([operator])
    .rpc();

  // Print result
  const exploration = await program.account.explorationState.fetch(explorationPDA);
  console.log('\n🏆 Exploration Settled!');
  console.log('   Winning Rig:', exploration.winningRig);
  console.log('   Total Pool:', (exploration.totalDeposits.toNumber() / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
  console.log('   W (Winner deposits):', (exploration.totalWinnerDeposits.toNumber() / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
  console.log('   L (Loser deposits):', (exploration.totalLoserDeposits.toNumber() / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
  console.log('   R (Remaining pool):', (exploration.remainingPool.toNumber() / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
}

// Main entry point
const command = process.argv[2];

switch (command) {
  case 'start':
    startExploration().catch(console.error);
    break;
  case 'deposit':
    makeDeposits().catch(console.error);
    break;
  case 'finalize':
    finalizeExploration().catch(console.error);
    break;
  default:
    console.log('Usage: npx ts-node scripts/simulate-exploration.ts <start|deposit|finalize>');
}
