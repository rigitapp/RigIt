"use client";

import { useEffect, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "./use-program";
import { BLOCK_IDS, RIGS_PER_EXPLORATION, type BlockSymbol } from "./constants";

export interface ExplorationData {
  explorationIndex: number;
  status: string;
  startTs: number;
  activeEndTs: number;
  cooldownEndTs: number;
  totalDeposits: number;
  rigDeposits: number[];
  rigTickets: number[];
  rolloverAmount: number;
  winningRig: number | null;
}

export interface RigData {
  index: number;
  totalDeposits: number;
  totalTickets: number;
  depositCount: number;
}

/**
 * Returns the current exploration state for a given block.
 *
 * Until the program is deployed and IDL generated, returns null.
 * Components should handle the null case with an appropriate empty state.
 */
export function useExploration(block: BlockSymbol) {
  const program = useProgram();
  const { connection } = useConnection();
  const [exploration, setExploration] = useState<ExplorationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!program) {
      setExploration(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This will work once the IDL is loaded and program is deployed:
      //
      // const blockId = BLOCK_IDS[block];
      // const blockState = await program.account.blockState.fetch(blockStatePDA);
      // const currentIndex = blockState.currentExplorationIndex.subn(1);
      // if (currentIndex.ltn(0)) { setExploration(null); return; }
      // const explorationState = await program.account.explorationState.fetch(explorationPDA);
      // setExploration(mapToExplorationData(explorationState));
      //
      setExploration(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exploration");
      setExploration(null);
    } finally {
      setLoading(false);
    }
  }, [program, block, connection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { exploration, loading, error, refresh };
}

/**
 * Returns all 36 rig states for the current exploration of a block.
 *
 * Until the program is deployed, returns an empty array.
 */
export function useRigs(block: BlockSymbol) {
  const program = useProgram();
  const [rigs, setRigs] = useState<RigData[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!program) {
      setRigs([]);
      return;
    }

    setLoading(true);
    try {
      // Once IDL available:
      // const explorationPDA = getExplorationStatePDA(...)
      // const rigStates = await Promise.all(
      //   Array.from({ length: RIGS_PER_EXPLORATION }, (_, i) =>
      //     program.account.rigState.fetch(getRigStatePDA(explorationPDA, i))
      //   )
      // );
      // setRigs(rigStates.map(mapToRigData));
      //
      setRigs([]);
    } catch {
      setRigs([]);
    } finally {
      setLoading(false);
    }
  }, [program, block]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rigs, loading, refresh };
}

/**
 * Returns past exploration history for a block.
 *
 * For a new project, this is empty. Once explorations are settled,
 * they appear here.
 */
export function useExplorationHistory(block: BlockSymbol) {
  const program = useProgram();
  const [history, setHistory] = useState<ExplorationData[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!program) {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      // Once IDL available:
      // Fetch all settled explorations for this block via getProgramAccounts filter
      // or an indexer service
      setHistory([]);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [program, block]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { history, loading, refresh };
}
