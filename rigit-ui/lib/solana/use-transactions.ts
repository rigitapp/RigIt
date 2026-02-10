"use client";

import { useCallback, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProvider, useProgram } from "./use-program";
import { BLOCK_IDS, type BlockSymbol } from "./constants";
import BN from "bn.js";

export interface DepositParams {
  block: BlockSymbol;
  rigIndex: number;
  amount: number; // in SOL (not lamports)
  depositNonce?: number;
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Hook for depositing tokens into a rig.
 *
 * Returns a `deposit` function + loading/error state.
 * The transaction is built and sent on-chain once the program is deployed.
 */
export function useDeposit() {
  const program = useProgram();
  const provider = useAnchorProvider();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deposit = useCallback(
    async (params: DepositParams): Promise<TransactionResult> => {
      setError(null);

      if (!wallet.publicKey) {
        setError("Wallet not connected");
        return { success: false, error: "Wallet not connected" };
      }

      if (!program || !provider) {
        setError("Program not deployed — deploy to devnet first");
        return {
          success: false,
          error:
            "Program not deployed yet. Run `anchor build && anchor deploy --provider.cluster devnet` first.",
        };
      }

      setLoading(true);
      try {
        const blockId = BLOCK_IDS[params.block];
        const amountLamports = new BN(Math.floor(params.amount * 1e9)); // SOL → lamports
        const nonce = new BN(params.depositNonce ?? Date.now());

        // Build the deposit_to_rig instruction via Anchor
        // This code is ready — it just needs the Program instance (IDL)
        //
        // const tx = await program.methods
        //   .depositToRig({
        //     rigIndex: params.rigIndex,
        //     amount: amountLamports,
        //     depositNonce: nonce,
        //   })
        //   .accounts({
        //     ...deriveDepositAccounts(blockId, explorationIndex, params.rigIndex, wallet.publicKey, nonce),
        //   })
        //   .rpc();
        //
        // return { success: true, signature: tx };

        setError("Program not deployed — deposit unavailable");
        return { success: false, error: "Program not deployed yet" };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Deposit failed";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [program, provider, wallet.publicKey, connection]
  );

  return { deposit, loading, error };
}

/**
 * Hook for claiming winnings from a winning rig deposit.
 */
export function useClaimWinnings() {
  const program = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = useCallback(async (): Promise<TransactionResult> => {
    setError(null);

    if (!wallet.publicKey) {
      setError("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }

    if (!program) {
      setError("Program not deployed");
      return { success: false, error: "Program not deployed yet" };
    }

    setLoading(true);
    try {
      // Once IDL available:
      // const tx = await program.methods
      //   .claimWinnings()
      //   .accounts({ depositReceipt, ... })
      //   .rpc();
      // return { success: true, signature: tx };

      setError("Program not deployed — claim unavailable");
      return { success: false, error: "Program not deployed yet" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Claim failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  return { claim, loading, error };
}

/**
 * Hook for claiming a 50% refund on a losing rig deposit.
 */
export function useClaimRefund() {
  const program = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimRefund = useCallback(async (): Promise<TransactionResult> => {
    setError(null);

    if (!wallet.publicKey) {
      setError("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }

    if (!program) {
      setError("Program not deployed");
      return { success: false, error: "Program not deployed yet" };
    }

    setLoading(true);
    try {
      // Once IDL available:
      // const tx = await program.methods
      //   .refundLoser()
      //   .accounts({ depositReceipt, ... })
      //   .rpc();
      // return { success: true, signature: tx };

      setError("Program not deployed — refund unavailable");
      return { success: false, error: "Program not deployed yet" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Refund failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  return { claimRefund, loading, error };
}
