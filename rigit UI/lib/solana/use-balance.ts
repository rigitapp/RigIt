"use client";

import { useEffect, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, type PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

/**
 * Returns the connected wallet's SOL balance in SOL (not lamports).
 */
export function useSolBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setLoading(true);
    try {
      const lamports = await connection.getBalance(publicKey, "confirmed");
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refresh();

    if (!publicKey) return;

    // Subscribe to balance changes
    const subId = connection.onAccountChange(publicKey, (accountInfo) => {
      setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      connection.removeAccountChangeListener(subId);
    };
  }, [connection, publicKey, refresh]);

  return { balance, loading, refresh };
}

/**
 * Returns the connected wallet's SPL token balance for a given mint.
 * Returns null if no associated token account exists.
 */
export function useTokenBalance(mint: PublicKey | null) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicKey || !mint) {
      setBalance(null);
      return;
    }

    setLoading(true);
    try {
      const ata = await getAssociatedTokenAddress(mint, publicKey);
      const account = await getAccount(connection, ata, "confirmed");
      // Assuming 9 decimals for $RIG token
      setBalance(Number(account.amount) / 1e9);
    } catch {
      // Account doesn't exist or other error
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, mint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}
