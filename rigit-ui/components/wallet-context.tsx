"use client";

/**
 * Re-exports the real Solana wallet adapter hooks.
 *
 * Components that previously imported { useWallet } from "@/components/wallet-context"
 * now get the real @solana/wallet-adapter-react hook. The WalletProvider wrapper
 * is no longer needed per-page — SolanaProvider in layout.tsx handles it globally.
 */

import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState, type ReactNode } from "react";

// Re-export the real hooks
export { useConnection } from "@solana/wallet-adapter-react";

/**
 * Drop-in replacement for the old useWallet() hook.
 * Returns the same shape the components expect:
 *   {
 *     connected,
 *     connecting,
 *     publicKey,
 *     connect,
 *     connectWallet,
 *     disconnect
 *   }
 */
export function useWallet() {
  const wallet = useSolanaWallet();
  const { setVisible } = useWalletModal();
  const [connectRequested, setConnectRequested] = useState(false);

  const connectWallet = useCallback(() => {
    if (wallet.wallet) {
      // Wallet already selected (e.g. previously connected) — just connect
      wallet.connect().catch(() => null);
      return;
    }
    // No wallet selected yet — open the modal to let user pick
    setConnectRequested(true);
    setVisible(true);
  }, [wallet, setVisible]);

  useEffect(() => {
    if (!connectRequested) return;
    if (!wallet.wallet) return;
    if (wallet.connected || wallet.connecting) {
      setConnectRequested(false);
      return;
    }
    wallet
      .connect()
      .catch(() => null)
      .finally(() => setConnectRequested(false));
  }, [connectRequested, wallet]);

  const disconnect = useCallback(async () => {
    try {
      await wallet.disconnect();
    } catch {
      // ignore
    }
  }, [wallet]);

  return {
    connected: wallet.connected,
    connecting: wallet.connecting,
    publicKey: wallet.publicKey?.toBase58() ?? null,
    publicKeyObj: wallet.publicKey,
    connect: connectWallet,
    connectWallet,
    disconnect,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
    wallet: wallet.wallet,
  };
}

/**
 * Legacy WalletProvider wrapper — now a no-op passthrough.
 * Kept so existing <WalletProvider> usage in pages doesn't break,
 * but the real provider lives in SolanaProvider (layout.tsx).
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
