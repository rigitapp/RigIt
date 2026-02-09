"use client";

import { useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { PROGRAM_ID } from "./constants";

/**
 * Returns an AnchorProvider if wallet is connected, null otherwise.
 */
export function useAnchorProvider(): AnchorProvider | null {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return null;
    }

    return new AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      },
      { commitment: "confirmed" }
    );
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);
}

/**
 * Returns a Program instance if IDL is loaded and wallet is connected.
 *
 * For now returns null — the IDL will be generated after `anchor build`.
 * Once the IDL JSON is available, import it here and pass to Program constructor.
 *
 * Usage:
 *   const program = useProgram();
 *   if (!program) return <NotDeployed />;
 */
export function useProgram(): Program | null {
  const provider = useAnchorProvider();

  return useMemo(() => {
    if (!provider) return null;

    // TODO: Once `anchor build` generates the IDL, import it:
    //   import idl from "@/lib/solana/idl/rig_it.json";
    //   return new Program(idl as Idl, PROGRAM_ID, provider);
    //
    // Until then, program interactions are not available.
    return null;
  }, [provider]);
}
