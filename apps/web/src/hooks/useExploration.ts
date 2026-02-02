'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import type { ExplorationState, RigState } from '@rig-it/sdk';
import {
  getCurrentPhase,
  getTimeRemaining,
  calculateExplorationTiming,
  type ExplorationPhase,
} from '@rig-it/sdk';

interface UseExplorationResult {
  exploration: ExplorationState | null;
  rigs: (RigState | null)[];
  phase: ExplorationPhase;
  timeRemaining: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useExploration(blockId: number): UseExplorationResult {
  const { connection } = useConnection();
  const [exploration, setExploration] = useState<ExplorationState | null>(null);
  const [rigs, setRigs] = useState<(RigState | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [phase, setPhase] = useState<ExplorationPhase>('ended');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const fetchExploration = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, use RigItClient to fetch real data
      // For now, return mock data
      
      const mockStartTs = Math.floor(Date.now() / 1000) - 3600; // Started 1 hour ago
      const timing = calculateExplorationTiming(mockStartTs);

      const mockExploration: ExplorationState = {
        blockId,
        explorationIndex: BigInt(42) as any,
        status: 'active' as any,
        startSlot: BigInt(0) as any,
        startTs: BigInt(mockStartTs) as any,
        activeEndTs: BigInt(timing.activeEndTs) as any,
        cooldownEndTs: BigInt(timing.cooldownEndTs) as any,
        totalDeposits: BigInt(45_500_000_000) as any, // 45.5 SOL
        rigDeposits: new Array(36).fill(BigInt(0)) as any,
        rigTickets: new Array(36).fill(BigInt(0)) as any,
        rolloverAmount: BigInt(5_000_000_000) as any, // 5 SOL rollover
        commitSlot: BigInt(0) as any,
        commitHash: new Uint8Array(32),
        revealDeadlineSlot: BigInt(0) as any,
        revealedRandom: null,
        winningRig: null,
        loserRefundsProcessed: false,
        winnerDistributionProcessed: false,
        buybackAllocated: false,
        carryForwardDone: false,
        totalWinnerDeposits: BigInt(0) as any,
        totalLoserDeposits: BigInt(0) as any,
        remainingPool: BigInt(0) as any,
        bump: 0,
      };

      // Generate some random rig data
      const mockRigs: (RigState | null)[] = new Array(36).fill(null).map((_, i) => {
        if (Math.random() > 0.6) return null;
        return {
          exploration: {} as any,
          rigIndex: i,
          totalDeposits: BigInt(Math.floor(Math.random() * 5_000_000_000)) as any,
          totalTickets: BigInt(Math.floor(Math.random() * 10000)) as any,
          depositCount: Math.floor(Math.random() * 10),
          bump: 0,
        };
      });

      setExploration(mockExploration);
      setRigs(mockRigs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch exploration'));
    } finally {
      setIsLoading(false);
    }
  }, [blockId, connection]);

  // Fetch on mount and when blockId changes
  useEffect(() => {
    fetchExploration();
  }, [fetchExploration]);

  // Update phase and time remaining every second
  useEffect(() => {
    if (!exploration) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const timing = {
        startTs: Number(exploration.startTs),
        activeEndTs: Number(exploration.activeEndTs),
        cooldownEndTs: Number(exploration.cooldownEndTs),
        antiSnipeStartTs: Number(exploration.activeEndTs) - 300,
      };

      const currentPhase = getCurrentPhase(now, timing);
      const remaining = getTimeRemaining(now, timing);

      setPhase(currentPhase);
      setTimeRemaining(remaining.secondsRemaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [exploration]);

  return {
    exploration,
    rigs,
    phase,
    timeRemaining,
    isLoading,
    error,
    refetch: fetchExploration,
  };
}
