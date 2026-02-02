'use client';

import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'RiG1tPRogRamXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
);

export function useRigIt() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // In production, initialize RigItClient here
  // const client = useMemo(() => {
  //   if (!wallet.publicKey) return null;
  //   return new RigItClient(connection, wallet, PROGRAM_ID, idl);
  // }, [connection, wallet]);

  const depositToRig = async (
    blockId: number,
    explorationIndex: bigint,
    rigIndex: number,
    amount: number
  ) => {
    if (!wallet.connected || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // In production:
    // const nonce = Date.now();
    // return client.depositToRig(blockId, new BN(explorationIndex.toString()), {
    //   rigIndex,
    //   amount: new BN(amount),
    //   depositNonce: new BN(nonce),
    // });

    console.log('Mock deposit:', { blockId, explorationIndex, rigIndex, amount });
    return 'mock-signature';
  };

  const claimRefund = async (depositReceiptKey: PublicKey) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    // In production: return client.refundLoser(depositReceiptKey);
    console.log('Mock claim refund:', depositReceiptKey.toBase58());
    return 'mock-signature';
  };

  const claimWinnings = async (depositReceiptKey: PublicKey) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    // In production: return client.claimWinnings(depositReceiptKey);
    console.log('Mock claim winnings:', depositReceiptKey.toBase58());
    return 'mock-signature';
  };

  return {
    connected: wallet.connected,
    publicKey: wallet.publicKey,
    depositToRig,
    claimRefund,
    claimWinnings,
  };
}
