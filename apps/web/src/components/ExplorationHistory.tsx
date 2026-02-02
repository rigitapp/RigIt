'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplorationHistoryProps {
  blockId: number;
}

interface HistoryEntry {
  explorationIndex: number;
  winningRig: number;
  totalPool: number;
  winnerPayout: number;
  status: 'settled' | 'rolled_over';
  timestamp: number;
}

export const ExplorationHistory: FC<ExplorationHistoryProps> = ({ blockId }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Mock data - in production, fetch from chain/indexer
  const history: HistoryEntry[] = [
    {
      explorationIndex: 42,
      winningRig: 17,
      totalPool: 125.5,
      winnerPayout: 47.0625,
      status: 'settled',
      timestamp: Date.now() - 3600000,
    },
    {
      explorationIndex: 41,
      winningRig: 8,
      totalPool: 89.2,
      winnerPayout: 33.45,
      status: 'settled',
      timestamp: Date.now() - 7200000 * 2,
    },
    {
      explorationIndex: 40,
      winningRig: -1,
      totalPool: 15.0,
      winnerPayout: 0,
      status: 'rolled_over',
      timestamp: Date.now() - 7200000 * 3,
    },
    {
      explorationIndex: 39,
      winningRig: 23,
      totalPool: 203.7,
      winnerPayout: 76.39,
      status: 'settled',
      timestamp: Date.now() - 7200000 * 4,
    },
  ];

  return (
    <div className="bg-rig-charcoal rounded-xl p-6 border border-rig-steel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-rig-silver">EXPLORATION HISTORY</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rig-neon" />
            <span className="text-xs text-rig-chrome">Settled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rig-amber" />
            <span className="text-xs text-rig-chrome">Rolled Over</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rig-steel">
              <th className="text-left py-3 px-2 text-xs text-rig-chrome font-normal">
                #
              </th>
              <th className="text-left py-3 px-2 text-xs text-rig-chrome font-normal">
                Status
              </th>
              <th className="text-left py-3 px-2 text-xs text-rig-chrome font-normal">
                Winner
              </th>
              <th className="text-right py-3 px-2 text-xs text-rig-chrome font-normal">
                Pool
              </th>
              <th className="text-right py-3 px-2 text-xs text-rig-chrome font-normal">
                Payout
              </th>
              <th className="text-right py-3 px-2 text-xs text-rig-chrome font-normal">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <motion.tr
                key={entry.explorationIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  border-b border-rig-steel/50 cursor-pointer hover:bg-rig-steel/30 transition-colors
                  ${expanded === entry.explorationIndex ? 'bg-rig-steel/20' : ''}
                `}
                onClick={() =>
                  setExpanded(
                    expanded === entry.explorationIndex
                      ? null
                      : entry.explorationIndex
                  )
                }
              >
                <td className="py-3 px-2">
                  <span className="font-mono text-rig-silver">
                    {entry.explorationIndex}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-mono
                      ${entry.status === 'settled'
                        ? 'bg-rig-neon/20 text-rig-neon'
                        : 'bg-rig-amber/20 text-rig-amber'
                      }
                    `}
                  >
                    {entry.status === 'settled' ? 'SETTLED' : 'ROLLOVER'}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {entry.status === 'settled' ? (
                    <span className="font-display text-rig-gold">
                      RIG #{entry.winningRig + 1}
                    </span>
                  ) : (
                    <span className="text-rig-chrome">—</span>
                  )}
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-mono text-rig-silver">
                    {entry.totalPool.toFixed(2)} SOL
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  {entry.status === 'settled' ? (
                    <span className="font-mono text-rig-neon">
                      {entry.winnerPayout.toFixed(4)} SOL
                    </span>
                  ) : (
                    <span className="text-rig-chrome">—</span>
                  )}
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-xs text-rig-chrome">
                    {formatTimeAgo(entry.timestamp)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-rig-steel/30 rounded-xl p-4">
              <h4 className="font-display text-sm text-rig-gold mb-3">
                EXPLORATION #{expanded} DETAILS
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-rig-chrome">Winners Refund</p>
                  <p className="font-mono text-rig-silver">0 SOL</p>
                </div>
                <div>
                  <p className="text-xs text-rig-chrome">Losers Refund (50%)</p>
                  <p className="font-mono text-rig-silver">31.375 SOL</p>
                </div>
                <div>
                  <p className="text-xs text-rig-chrome">Buyback Pool</p>
                  <p className="font-mono text-rig-electric">28.24 SOL</p>
                </div>
                <div>
                  <p className="text-xs text-rig-chrome">Ecosystem Carry</p>
                  <p className="font-mono text-rig-amber">9.41 SOL</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
