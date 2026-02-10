// Mock data for Rig It hackathon project

export type BlockType = "SOL" | "PUMP" | "SKR";

export interface Rig {
  id: number;
  totalPooled: number;
  userContribution: number;
  participantCount: number;
}

export interface ExplorationHistory {
  id: number;
  explorationNumber: number;
  block: BlockType;
  winningRig: number;
  totalPool: number;
  winnerPayout: number;
  refundPercentage: number;
  timestamp: Date;
  status: "completed" | "rollover";
}

export interface Treasury {
  buybackBudget: number;
  burnedAmount: number;
  lpLockedAmount: number;
}

export interface UserStats {
  totalDeposited: number;
  ticketMultiplier: number;
  rigHoldings: number;
  selectedRig: number | null;
}

export interface BlockMetrics {
  totalPool: number;
  participants: number;
  threshold: number;
  lastWinnerRig: number;
  lastExploration: number;
  lastPool: number;
}

const MOCK_NOW = Date.UTC(2026, 1, 9, 12, 0, 0);

const createSeededRng = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

// Current exploration state
export const currentExploration = {
  number: 7,
  totalExplorations: 9,
  activeBlock: "SOL" as BlockType,
  isActive: true,
  isCooldown: false,
  // Exploration ends in ~1h 23m (mock)
  endsAt: new Date(MOCK_NOW + 1 * 60 * 60 * 1000 + 23 * 60 * 1000),
  minimumThreshold: 50,
  currentTotal: 127.5,
};

// Generate 36 rigs with mock data
export const generateRigs = (): Rig[] => {
  const rng = createSeededRng(0x1a2b3c4d);
  return Array.from({ length: 36 }, (_, i) => ({
    id: i + 1,
    totalPooled: rng() * 15 + 0.5,
    userContribution: i === 14 ? 2.5 : i === 22 ? 1.0 : 0,
    participantCount: Math.floor(rng() * 20) + 1,
  }));
};

// Mock exploration history per block
export const explorationHistoryByBlock: Record<BlockType, ExplorationHistory[]> = {
  SOL: [
    {
      id: 1,
      explorationNumber: 6,
      block: "SOL",
      winningRig: 23,
      totalPool: 245.8,
      winnerPayout: 122.9,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 3 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 2,
      explorationNumber: 5,
      block: "SOL",
      winningRig: 17,
      totalPool: 189.6,
      winnerPayout: 94.8,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 1 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 3,
      explorationNumber: 4,
      block: "SOL",
      winningRig: 0,
      totalPool: 42.3,
      winnerPayout: 0,
      refundPercentage: 100,
      timestamp: new Date(MOCK_NOW - 2 * 24 * 60 * 60 * 1000),
      status: "rollover",
    },
    {
      id: 4,
      explorationNumber: 3,
      block: "SOL",
      winningRig: 31,
      totalPool: 278.4,
      winnerPayout: 139.2,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 5,
      explorationNumber: 2,
      block: "SOL",
      winningRig: 12,
      totalPool: 156.9,
      winnerPayout: 78.45,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 4 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 6,
      explorationNumber: 1,
      block: "SOL",
      winningRig: 5,
      totalPool: 89.2,
      winnerPayout: 44.6,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 5 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
  ],
  PUMP: [
    {
      id: 1,
      explorationNumber: 5,
      block: "PUMP",
      winningRig: 8,
      totalPool: 312.4,
      winnerPayout: 156.2,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 5.5 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 2,
      explorationNumber: 4,
      block: "PUMP",
      winningRig: 29,
      totalPool: 445.1,
      winnerPayout: 222.55,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 1 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 3,
      explorationNumber: 3,
      block: "PUMP",
      winningRig: 14,
      totalPool: 198.7,
      winnerPayout: 99.35,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 4,
      explorationNumber: 2,
      block: "PUMP",
      winningRig: 0,
      totalPool: 28.5,
      winnerPayout: 0,
      refundPercentage: 100,
      timestamp: new Date(MOCK_NOW - 3 * 24 * 60 * 60 * 1000),
      status: "rollover",
    },
    {
      id: 5,
      explorationNumber: 1,
      block: "PUMP",
      winningRig: 36,
      totalPool: 167.3,
      winnerPayout: 83.65,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 4 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
  ],
  SKR: [
    {
      id: 1,
      explorationNumber: 4,
      block: "SKR",
      winningRig: 0,
      totalPool: 38.2,
      winnerPayout: 0,
      refundPercentage: 100,
      timestamp: new Date(MOCK_NOW - 8 * 60 * 60 * 1000),
      status: "rollover",
    },
    {
      id: 2,
      explorationNumber: 3,
      block: "SKR",
      winningRig: 19,
      totalPool: 124.6,
      winnerPayout: 62.3,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 1 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 3,
      explorationNumber: 2,
      block: "SKR",
      winningRig: 7,
      totalPool: 98.4,
      winnerPayout: 49.2,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 4,
      explorationNumber: 1,
      block: "SKR",
      winningRig: 22,
      totalPool: 156.8,
      winnerPayout: 78.4,
      refundPercentage: 50,
      timestamp: new Date(MOCK_NOW - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
  ],
};

// Mock treasury data
export const treasury: Treasury = {
  buybackBudget: 1847.32,
  burnedAmount: 12450.0,
  lpLockedAmount: 8920.5,
};

// Mock user stats
export const userStats: UserStats = {
  totalDeposited: 3.5,
  ticketMultiplier: 1.5,
  rigHoldings: 2500,
  selectedRig: 15,
};

// Block token info
export const blockInfo: Record<
  BlockType,
  { name: string; symbol: string; color: string; icon: string }
> = {
  SOL: {
    name: "Solana",
    symbol: "SOL",
    color: "from-[#9945FF] to-[#14F195]",
    icon: "S",
  },
  PUMP: {
    name: "Pump Token",
    symbol: "PUMP",
    color: "from-amber-500 to-orange-600",
    icon: "pump", // Uses PumpLogo component
  },
  SKR: {
    name: "Seeker",
    symbol: "SKR",
    color: "from-cyan-400 to-blue-600",
    icon: "skr", // Uses SkrLogo component
  },
};

export const blockMetrics: Record<BlockType, BlockMetrics> = {
  SOL: {
    totalPool: 127.5,
    participants: 89,
    threshold: 50,
    lastWinnerRig: 23,
    lastExploration: 6,
    lastPool: 245.8,
  },
  PUMP: {
    totalPool: 245.3,
    participants: 156,
    threshold: 100,
    lastWinnerRig: 8,
    lastExploration: 5,
    lastPool: 312.4,
  },
  SKR: {
    totalPool: 78.2,
    participants: 42,
    threshold: 40,
    lastWinnerRig: 19,
    lastExploration: 3,
    lastPool: 124.6,
  },
};
