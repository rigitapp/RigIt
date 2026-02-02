/**
 * Initialize local development environment
 * 
 * Usage: npx ts-node scripts/init-local.ts
 * 
 * Prerequisites:
 * - solana-test-validator running
 * - Program deployed via `anchor deploy`
 */

import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🔧 Initializing Rig It local environment...\n');

  // Load provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load program
  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../target/idl/rig_it.json'), 'utf8')
  );
  const programId = new PublicKey(idl.metadata.address);
  const program = new Program(idl, programId, provider);

  console.log('📍 Program ID:', programId.toBase58());
  console.log('👤 Admin:', provider.wallet.publicKey.toBase58());

  // Generate operator keypair
  const operatorKeypair = Keypair.generate();
  const emergencyAdminKeypair = Keypair.generate();

  // Airdrop to operator
  console.log('\n💰 Airdropping SOL to operator...');
  const airdropSig = await provider.connection.requestAirdrop(
    operatorKeypair.publicKey,
    10 * LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(airdropSig);
  console.log('✅ Operator funded:', operatorKeypair.publicKey.toBase58());

  // Create $RIG token mint
  console.log('\n🪙 Creating $RIG token mint...');
  const rigTokenMint = await createMint(
    provider.connection,
    (provider.wallet as any).payer,
    provider.wallet.publicKey,
    null,
    9
  );
  console.log('✅ $RIG Mint:', rigTokenMint.toBase58());

  // Create wrapped SOL mint (for testing)
  console.log('\n🪙 Creating test SOL token mint...');
  const solTokenMint = await createMint(
    provider.connection,
    (provider.wallet as any).payer,
    provider.wallet.publicKey,
    null,
    9
  );
  console.log('✅ Test SOL Mint:', solTokenMint.toBase58());

  // Derive PDAs
  const [protocolConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('protocol')],
    programId
  );

  // Initialize protocol
  console.log('\n🚀 Initializing protocol...');
  try {
    await program.methods
      .initProtocol({
        operator: operatorKeypair.publicKey,
        emergencyAdmin: emergencyAdminKeypair.publicKey,
      })
      .accounts({
        protocolConfig: protocolConfigPDA,
        rigTokenMint,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log('✅ Protocol initialized');
  } catch (error: any) {
    if (error.message.includes('already in use')) {
      console.log('⚠️ Protocol already initialized');
    } else {
      throw error;
    }
  }

  // Initialize SOL Block
  console.log('\n🏗️ Initializing SOL Block...');
  const SOL_BLOCK_ID = 0;
  const [solBlockPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('block'), Buffer.from([SOL_BLOCK_ID])],
    programId
  );
  const [solBlockVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('block_vault'), Buffer.from([SOL_BLOCK_ID])],
    programId
  );
  const [solBlockVaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('block_vault_authority'), Buffer.from([SOL_BLOCK_ID])],
    programId
  );

  try {
    await program.methods
      .initBlock({
        blockId: SOL_BLOCK_ID,
        minThreshold: new BN(1 * LAMPORTS_PER_SOL),
      })
      .accounts({
        protocolConfig: protocolConfigPDA,
        blockState: solBlockPDA,
        blockVault: solBlockVault,
        blockVaultAuthority: solBlockVaultAuthority,
        assetMint: solTokenMint,
        admin: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log('✅ SOL Block initialized');
  } catch (error: any) {
    if (error.message.includes('already in use')) {
      console.log('⚠️ SOL Block already initialized');
    } else {
      throw error;
    }
  }

  // Save configuration
  const config = {
    programId: programId.toBase58(),
    rigTokenMint: rigTokenMint.toBase58(),
    solTokenMint: solTokenMint.toBase58(),
    protocolConfig: protocolConfigPDA.toBase58(),
    operatorPublicKey: operatorKeypair.publicKey.toBase58(),
    operatorSecretKey: Array.from(operatorKeypair.secretKey),
    emergencyAdminPublicKey: emergencyAdminKeypair.publicKey.toBase58(),
    emergencyAdminSecretKey: Array.from(emergencyAdminKeypair.secretKey),
    blocks: {
      sol: {
        blockId: SOL_BLOCK_ID,
        blockState: solBlockPDA.toBase58(),
        blockVault: solBlockVault.toBase58(),
        assetMint: solTokenMint.toBase58(),
      },
    },
  };

  const configPath = path.join(__dirname, '../.local-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('\n📄 Configuration saved to:', configPath);

  console.log('\n✨ Local environment initialized successfully!\n');
  console.log('Next steps:');
  console.log('1. Start an exploration:');
  console.log('   npx ts-node scripts/simulate-exploration.ts start');
  console.log('2. Make deposits:');
  console.log('   npx ts-node scripts/simulate-exploration.ts deposit');
  console.log('3. Finalize exploration:');
  console.log('   npx ts-node scripts/simulate-exploration.ts finalize');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
