'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

interface UserDepositsProps {
  blockId: number;
}

export const UserDeposits: FC<UserDepositsProps> = ({ blockId }) => {
  const { connected, publicKey } = useWallet();

  // Mock data - in production, fetch from chain via useExploration hook
  const deposits = [
    { rigIndex: 5, amount: 0.5, tickets: 707, status: 'active' },
    { rigIndex: 12, amount: 1.0, tickets: 1000, status: 'active' },
  ];

  const totalDeposited = deposits.reduce((acc, d) => acc + d.amount, 0);
  const totalTickets = deposits.reduce((acc, d) => acc + d.tickets, 0);

  if (!connected) {
    return (
      <div className="bg-rig-charcoal rounded-xl p-6 border border-rig-steel">
        <h3 className="font-display text-lg text-rig-silver mb-4">YOUR DEPOSITS</h3>
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">🔗</span>
          <p className="text-rig-chrome text-sm">
            Connect your wallet to view deposits
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rig-charcoal rounded-xl p-6 border border-rig-steel">
      <h3 className="font-display text-lg text-rig-silver mb-4">YOUR DEPOSITS</h3>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-rig-steel/50 rounded-lg p-3">
          <p className="text-xs text-rig-chrome">Total Deposited</p>
          <p className="text-lg font-mono text-rig-gold">{totalDeposited} SOL</p>
        </div>
        <div className="bg-rig-steel/50 rounded-lg p-3">
          <p className="text-xs text-rig-chrome">Total Tickets</p>
          <p className="text-lg font-mono text-rig-neon">{totalTickets.toLocaleString()}</p>
        </div>
      </div>

      {/* Deposit List */}
      <div className="space-y-2">
        {deposits.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-3xl mb-2 block">🎰</span>
            <p className="text-rig-chrome text-sm">No deposits yet</p>
            <p className="text-xs text-rig-iron mt-1">Select a rig to deposit</p>
          </div>
        ) : (
          deposits.map((deposit, index) => (
            <motion.div
              key={`${deposit.rigIndex}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-rig-steel/30 rounded-lg border border-rig-steel"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rig-gold/20 flex items-center justify-center">
                  <span className="font-display text-rig-gold">
                    {deposit.rigIndex + 1}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-sm text-rig-silver">
                    {deposit.amount} SOL
                  </p>
                  <p className="text-xs text-rig-chrome">
                    {deposit.tickets.toLocaleString()} tickets
                  </p>
                </div>
              </div>
              <div
                className={`
                  px-2 py-1 rounded text-xs font-mono
                  ${deposit.status === 'active' 
                    ? 'bg-rig-neon/20 text-rig-neon' 
                    : 'bg-rig-chrome/20 text-rig-chrome'
                  }
                `}
              >
                {deposit.status.toUpperCase()}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Win Probability */}
      {deposits.length > 0 && (
        <div className="mt-4 p-3 bg-rig-gold/10 rounded-lg border border-rig-gold/30">
          <div className="flex justify-between items-center">
            <span className="text-sm text-rig-chrome">Est. Win Probability</span>
            <span className="font-mono text-rig-gold">
              ~{((totalTickets / 100000) * 100).toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-rig-iron mt-1">
            Based on current pool distribution
          </p>
        </div>
      )}
    </div>
  );
};
