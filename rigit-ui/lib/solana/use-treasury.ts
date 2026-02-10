"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from "@solana/spl-token";
import { PROGRAM_ID } from "./constants";

export interface TreasuryStats {
  buybackBudget: number | null;
  buybackBurnVault: number | null;
  buybackLpVault: number | null;
  teamOpsVault: number | null;
  ecosystemVault: number | null;
  decimals: number;
}

const encoder = new TextEncoder();
const TREASURY_SEED = encoder.encode("treasury");

const getTreasuryPda = (label: string) =>
  PublicKey.findProgramAddressSync(
    [TREASURY_SEED, encoder.encode(label)],
    PROGRAM_ID
  )[0];

const TREASURY_PDAS = {
  buybackBurn: getTreasuryPda("buyback_burn"),
  buybackLp: getTreasuryPda("buyback_lp"),
  teamOps: getTreasuryPda("team_ops"),
  ecosystem: getTreasuryPda("ecosystem"),
};

export function useTreasuryStats() {
  const { connection } = useConnection();
  const [stats, setStats] = useState<TreasuryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const readAccount = async (address: PublicKey) => {
        try {
          return await getAccount(connection, address, "confirmed");
        } catch {
          return null;
        }
      };

      const [
        burnAccount,
        lpAccount,
        teamAccount,
        ecosystemAccount,
      ] = await Promise.all([
        readAccount(TREASURY_PDAS.buybackBurn),
        readAccount(TREASURY_PDAS.buybackLp),
        readAccount(TREASURY_PDAS.teamOps),
        readAccount(TREASURY_PDAS.ecosystem),
      ]);

      const mint =
        burnAccount?.mint ||
        lpAccount?.mint ||
        teamAccount?.mint ||
        ecosystemAccount?.mint ||
        null;

      let decimals = 9;
      if (mint) {
        try {
          const mintInfo = await getMint(connection, mint, "confirmed");
          decimals = mintInfo.decimals;
        } catch {
          decimals = 9;
        }
      }

      const toUiAmount = (account: typeof burnAccount) =>
        account ? Number(account.amount) / 10 ** decimals : null;

      const buybackBurnVault = toUiAmount(burnAccount);
      const buybackLpVault = toUiAmount(lpAccount);
      const teamOpsVault = toUiAmount(teamAccount);
      const ecosystemVault = toUiAmount(ecosystemAccount);

      const hasBuybackData =
        buybackBurnVault !== null || buybackLpVault !== null;
      const buybackBudget = hasBuybackData
        ? (buybackBurnVault ?? 0) + (buybackLpVault ?? 0)
        : null;

      setStats({
        buybackBudget,
        buybackBurnVault,
        buybackLpVault,
        teamOpsVault,
        ecosystemVault,
        decimals,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load treasury");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
