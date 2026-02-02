import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { expect } from 'chai';
import BN from 'bn.js';

import { RigIt } from '../target/types/rig_it';
import {
  getProtocolConfigPDA,
  getBlockStatePDA,
  getExplorationStatePDA,
  getRigStatePDA,
  getDepositReceiptPDA,
  getBlockVaultPDA,
  getBlockVaultAuthorityPDA,
} from './utils';

describe('Rig It Protocol', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RigIt as Program<RigIt>;
  
  // Test accounts
  let admin: Keypair;
  let operator: Keypair;
  let emergencyAdmin: Keypair;
  let user1: Keypair;
  let user2: Keypair;
  let user3: Keypair;
  
  // Token mints
  let rigTokenMint: PublicKey;
  let solTokenMint: PublicKey; // Wrapped SOL for testing
  
  // PDAs
  let protocolConfigPDA: PublicKey;
  let solBlockPDA: PublicKey;
  
  const SOL_BLOCK_ID = 0;
  const MIN_THRESHOLD = new BN(1_000_000_000); // 1 SOL

  before(async () => {
    // Generate keypairs
    admin = Keypair.generate();
    operator = Keypair.generate();
    emergencyAdmin = Keypair.generate();
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();

    // Airdrop SOL to all accounts
    const accounts = [admin, operator, emergencyAdmin, user1, user2, user3];
    for (const account of accounts) {
      const sig = await provider.connection.requestAirdrop(
        account.publicKey,
        100 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);
    }

    // Create $RIG token mint
    rigTokenMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9 // 9 decimals
    );

    // Create wrapped SOL mint for testing (in practice, use native SOL wrapper)
    solTokenMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9
    );

    // Derive PDAs
    [protocolConfigPDA] = getProtocolConfigPDA(program.programId);
    [solBlockPDA] = getBlockStatePDA(SOL_BLOCK_ID, program.programId);

    console.log('Test setup complete');
    console.log('Program ID:', program.programId.toBase58());
    console.log('$RIG Mint:', rigTokenMint.toBase58());
  });

  describe('Protocol Initialization', () => {
    it('should initialize the protocol', async () => {
      await program.methods
        .initProtocol({
          operator: operator.publicKey,
          emergencyAdmin: emergencyAdmin.publicKey,
        })
        .accounts({
          protocolConfig: protocolConfigPDA,
          rigTokenMint,
          admin: admin.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([admin])
        .rpc();

      const config = await program.account.protocolConfig.fetch(protocolConfigPDA);
      
      expect(config.admin.toBase58()).to.equal(admin.publicKey.toBase58());
      expect(config.operator.toBase58()).to.equal(operator.publicKey.toBase58());
      expect(config.rigTokenMint.toBase58()).to.equal(rigTokenMint.toBase58());
      expect(config.paused).to.be.false;
      expect(config.winnerShareBps).to.equal(5000);
      expect(config.buybackBurnBps).to.equal(1500);
      expect(config.buybackLpBps).to.equal(1500);
      expect(config.teamOpsBps).to.equal(1000);
      expect(config.ecosystemBps).to.equal(1000);
    });

    it('should fail to initialize twice', async () => {
      try {
        await program.methods
          .initProtocol({
            operator: operator.publicKey,
            emergencyAdmin: emergencyAdmin.publicKey,
          })
          .accounts({
            protocolConfig: protocolConfigPDA,
            rigTokenMint,
            admin: admin.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([admin])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('already in use');
      }
    });
  });

  describe('Block Initialization', () => {
    it('should initialize SOL block', async () => {
      const [blockVault] = getBlockVaultPDA(SOL_BLOCK_ID, program.programId);
      const [blockVaultAuthority] = getBlockVaultAuthorityPDA(SOL_BLOCK_ID, program.programId);

      await program.methods
        .initBlock({
          blockId: SOL_BLOCK_ID,
          minThreshold: MIN_THRESHOLD,
        })
        .accounts({
          protocolConfig: protocolConfigPDA,
          blockState: solBlockPDA,
          blockVault,
          blockVaultAuthority,
          assetMint: solTokenMint,
          admin: admin.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([admin])
        .rpc();

      const block = await program.account.blockState.fetch(solBlockPDA);
      
      expect(block.blockId).to.equal(SOL_BLOCK_ID);
      expect(block.assetMint.toBase58()).to.equal(solTokenMint.toBase58());
      expect(block.minThreshold.toString()).to.equal(MIN_THRESHOLD.toString());
      expect(block.currentExplorationIndex.toNumber()).to.equal(0);
      expect(block.paused).to.be.false;
    });

    it('should reject invalid block ID', async () => {
      const invalidBlockId = 5;
      const [invalidBlockPDA] = getBlockStatePDA(invalidBlockId, program.programId);
      const [blockVault] = getBlockVaultPDA(invalidBlockId, program.programId);
      const [blockVaultAuthority] = getBlockVaultAuthorityPDA(invalidBlockId, program.programId);

      try {
        await program.methods
          .initBlock({
            blockId: invalidBlockId,
            minThreshold: MIN_THRESHOLD,
          })
          .accounts({
            protocolConfig: protocolConfigPDA,
            blockState: invalidBlockPDA,
            blockVault,
            blockVaultAuthority,
            assetMint: solTokenMint,
            admin: admin.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([admin])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('InvalidBlockId');
      }
    });
  });

  describe('Exploration Lifecycle', () => {
    let explorationPDA: PublicKey;
    let explorationIndex: BN;

    before(async () => {
      // Get current exploration index from block
      const block = await program.account.blockState.fetch(solBlockPDA);
      explorationIndex = block.currentExplorationIndex;
      [explorationPDA] = getExplorationStatePDA(
        SOL_BLOCK_ID,
        explorationIndex,
        program.programId
      );
    });

    it('should start a new exploration', async () => {
      await program.methods
        .startExploration()
        .accounts({
          protocolConfig: protocolConfigPDA,
          blockState: solBlockPDA,
          explorationState: explorationPDA,
          previousExploration: null,
          operator: operator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([operator])
        .rpc();

      const exploration = await program.account.explorationState.fetch(explorationPDA);
      
      expect(exploration.blockId).to.equal(SOL_BLOCK_ID);
      expect(exploration.explorationIndex.toString()).to.equal(explorationIndex.toString());
      expect(exploration.status.active).to.exist;
      expect(exploration.totalDeposits.toNumber()).to.equal(0);
      expect(exploration.rolloverAmount.toNumber()).to.equal(0);
    });

    it('should fail to start exploration when not operator', async () => {
      try {
        const block = await program.account.blockState.fetch(solBlockPDA);
        const nextIndex = block.currentExplorationIndex;
        const [nextExplorationPDA] = getExplorationStatePDA(
          SOL_BLOCK_ID,
          nextIndex,
          program.programId
        );

        await program.methods
          .startExploration()
          .accounts({
            protocolConfig: protocolConfigPDA,
            blockState: solBlockPDA,
            explorationState: nextExplorationPDA,
            previousExploration: explorationPDA,
            operator: user1.publicKey, // Not operator
            systemProgram: anchor.web3.SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([user1])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('Unauthorized');
      }
    });
  });

  describe('Deposits', () => {
    let explorationPDA: PublicKey;
    let user1TokenAccount: PublicKey;
    let user2TokenAccount: PublicKey;

    before(async () => {
      // Get current exploration
      const block = await program.account.blockState.fetch(solBlockPDA);
      const currentIndex = block.currentExplorationIndex.subn(1);
      [explorationPDA] = getExplorationStatePDA(SOL_BLOCK_ID, currentIndex, program.programId);

      // Create token accounts and mint tokens to users
      const user1Account = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        admin,
        solTokenMint,
        user1.publicKey
      );
      user1TokenAccount = user1Account.address;

      const user2Account = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        admin,
        solTokenMint,
        user2.publicKey
      );
      user2TokenAccount = user2Account.address;

      // Mint tokens to users
      await mintTo(
        provider.connection,
        admin,
        solTokenMint,
        user1TokenAccount,
        admin,
        10 * LAMPORTS_PER_SOL
      );

      await mintTo(
        provider.connection,
        admin,
        solTokenMint,
        user2TokenAccount,
        admin,
        10 * LAMPORTS_PER_SOL
      );
    });

    it('should deposit to a rig', async () => {
      const rigIndex = 5;
      const amount = new BN(1 * LAMPORTS_PER_SOL);
      const depositNonce = new BN(Date.now());

      const [rigPDA] = getRigStatePDA(explorationPDA, rigIndex, program.programId);
      const [depositReceiptPDA] = getDepositReceiptPDA(
        rigPDA,
        user1.publicKey,
        depositNonce,
        program.programId
      );
      const [blockVault] = getBlockVaultPDA(SOL_BLOCK_ID, program.programId);

      await program.methods
        .depositToRig({
          rigIndex,
          amount,
          depositNonce,
        })
        .accounts({
          protocolConfig: protocolConfigPDA,
          blockState: solBlockPDA,
          explorationState: explorationPDA,
          rigState: rigPDA,
          depositReceipt: depositReceiptPDA,
          user: user1.publicKey,
          userTokenAccount: user1TokenAccount,
          blockVault,
          userRigTokenAccount: null,
          rigTokenMint: null,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([user1])
        .rpc();

      const receipt = await program.account.depositReceipt.fetch(depositReceiptPDA);
      
      expect(receipt.user.toBase58()).to.equal(user1.publicKey.toBase58());
      expect(receipt.amount.toString()).to.equal(amount.toString());
      expect(receipt.isAntiSniped).to.be.false;
      expect(receipt.refundClaimed).to.be.false;
      expect(receipt.winningsClaimed).to.be.false;

      // Check rig state updated
      const rig = await program.account.rigState.fetch(rigPDA);
      expect(rig.totalDeposits.toString()).to.equal(amount.toString());
      expect(rig.depositCount).to.equal(1);

      // Check exploration state updated
      const exploration = await program.account.explorationState.fetch(explorationPDA);
      expect(exploration.totalDeposits.toString()).to.equal(amount.toString());
    });

    it('should reject deposits below minimum', async () => {
      const rigIndex = 10;
      const amount = new BN(100); // Too small
      const depositNonce = new BN(Date.now());

      const [rigPDA] = getRigStatePDA(explorationPDA, rigIndex, program.programId);
      const [depositReceiptPDA] = getDepositReceiptPDA(
        rigPDA,
        user1.publicKey,
        depositNonce,
        program.programId
      );
      const [blockVault] = getBlockVaultPDA(SOL_BLOCK_ID, program.programId);

      try {
        await program.methods
          .depositToRig({
            rigIndex,
            amount,
            depositNonce,
          })
          .accounts({
            protocolConfig: protocolConfigPDA,
            blockState: solBlockPDA,
            explorationState: explorationPDA,
            rigState: rigPDA,
            depositReceipt: depositReceiptPDA,
            user: user1.publicKey,
            userTokenAccount: user1TokenAccount,
            blockVault,
            userRigTokenAccount: null,
            rigTokenMint: null,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([user1])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('DepositTooSmall');
      }
    });

    it('should reject invalid rig index', async () => {
      const rigIndex = 50; // Invalid (max is 35)
      const amount = new BN(1 * LAMPORTS_PER_SOL);
      const depositNonce = new BN(Date.now());

      const [rigPDA] = getRigStatePDA(explorationPDA, rigIndex, program.programId);
      const [depositReceiptPDA] = getDepositReceiptPDA(
        rigPDA,
        user1.publicKey,
        depositNonce,
        program.programId
      );
      const [blockVault] = getBlockVaultPDA(SOL_BLOCK_ID, program.programId);

      try {
        await program.methods
          .depositToRig({
            rigIndex,
            amount,
            depositNonce,
          })
          .accounts({
            protocolConfig: protocolConfigPDA,
            blockState: solBlockPDA,
            explorationState: explorationPDA,
            rigState: rigPDA,
            depositReceipt: depositReceiptPDA,
            user: user1.publicKey,
            userTokenAccount: user1TokenAccount,
            blockVault,
            userRigTokenAccount: null,
            rigTokenMint: null,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([user1])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('InvalidRigIndex');
      }
    });
  });

  describe('Emergency Pause', () => {
    it('should allow admin to pause', async () => {
      await program.methods
        .emergencyPause(true)
        .accounts({
          protocolConfig: protocolConfigPDA,
          authority: admin.publicKey,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([admin])
        .rpc();

      const config = await program.account.protocolConfig.fetch(protocolConfigPDA);
      expect(config.paused).to.be.true;
    });

    it('should allow emergency admin to unpause', async () => {
      await program.methods
        .emergencyPause(false)
        .accounts({
          protocolConfig: protocolConfigPDA,
          authority: emergencyAdmin.publicKey,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([emergencyAdmin])
        .rpc();

      const config = await program.account.protocolConfig.fetch(protocolConfigPDA);
      expect(config.paused).to.be.false;
    });

    it('should reject pause from unauthorized user', async () => {
      try {
        await program.methods
          .emergencyPause(true)
          .accounts({
            protocolConfig: protocolConfigPDA,
            authority: user1.publicKey,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([user1])
          .rpc();
        
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).to.include('Unauthorized');
      }
    });
  });
});

// Additional test suites for edge cases
describe('Rig It Edge Cases', () => {
  // These tests require more complex setup with time manipulation
  
  describe('Rollover Behavior', () => {
    it('should rollover when threshold not met', async () => {
      // TODO: Implement with mock clock
      // 1. Start exploration
      // 2. Deposit less than threshold
      // 3. Fast-forward past active phase
      // 4. Call commit_randomness
      // 5. Verify status is RolledOver
    });

    it('should carry forward funds to next exploration', async () => {
      // TODO: Implement
      // 1. Have a rolled-over exploration
      // 2. Start next exploration
      // 3. Call carry_forward
      // 4. Verify rollover_amount in next exploration
    });
  });

  describe('Payout Calculation', () => {
    it('should calculate R correctly', async () => {
      // TODO: Implement
      // Given:
      //   T = 100 SOL total deposits
      //   W = 30 SOL in winning rig
      //   L = 70 SOL in losing rigs
      // Then:
      //   Refund_total = 0.5 * 70 = 35 SOL (to losers)
      //   R = 100 - 35 = 65 SOL
      //   R = W + L/2 = 30 + 35 = 65 SOL ✓
    });

    it('should distribute winner payout pro-rata', async () => {
      // TODO: Implement
      // Winner pool = 50% of R
      // User share = winner_pool * (user_tickets / rig_total_tickets)
    });

    it('should refund losers 50% of deposit', async () => {
      // TODO: Implement
    });

    it('should not refund winners', async () => {
      // TODO: Implement
    });
  });

  describe('Anti-Snipe', () => {
    it('should mark deposits in final 5 minutes as anti-sniped', async () => {
      // TODO: Implement with mock clock
    });

    it('should not add anti-sniped deposits to current exploration', async () => {
      // TODO: Implement
    });

    it('should allow claiming anti-sniped deposits in next exploration', async () => {
      // TODO: Implement
    });
  });

  describe('Idempotency', () => {
    it('should prevent double refund claims', async () => {
      // TODO: Implement
    });

    it('should prevent double winning claims', async () => {
      // TODO: Implement
    });

    it('should prevent double buyback allocation', async () => {
      // TODO: Implement
    });
  });

  describe('Commit-Reveal Randomness', () => {
    it('should reject reveal with wrong secret', async () => {
      // TODO: Implement
    });

    it('should reject reveal before target slot', async () => {
      // TODO: Implement
    });

    it('should use timeout fallback after deadline', async () => {
      // TODO: Implement
    });

    it('should select winning rig based on ticket weights', async () => {
      // TODO: Implement
      // Verify weighted random selection
    });
  });
});
