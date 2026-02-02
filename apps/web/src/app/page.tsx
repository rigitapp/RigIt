'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockSelector } from '@/components/BlockSelector';
import { RigGrid } from '@/components/RigGrid';
import { ExplorationTimer } from '@/components/ExplorationTimer';
import { UserDeposits } from '@/components/UserDeposits';
import { ExplorationHistory } from '@/components/ExplorationHistory';
import { WalletButton } from '@/components/WalletButton';
import { DepositModal } from '@/components/DepositModal';
import { useExploration } from '@/hooks/useExploration';
import { BLOCK_IDS } from '@rig-it/sdk';

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<number>(BLOCK_IDS.SOL);
  const [selectedRig, setSelectedRig] = useState<number | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { exploration, rigs, phase, timeRemaining, refetch } = useExploration(selectedBlock);

  const handleRigClick = (rigIndex: number) => {
    setSelectedRig(rigIndex);
    setIsDepositModalOpen(true);
  };

  const handleDepositSuccess = () => {
    setIsDepositModalOpen(false);
    setSelectedRig(null);
    refetch();
  };

  return (
    <div className="min-h-screen industrial-grid">
      {/* Header */}
      <header className="border-b border-rig-steel bg-rig-charcoal/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-2xl">⚙️</span>
            </motion.div>
            <div>
              <h1 className="font-display text-3xl text-rig-gold tracking-wider">
                RIG IT
              </h1>
              <p className="text-xs text-rig-chrome font-mono">
                EXPLORATION #{exploration?.explorationIndex?.toString() || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rig-steel rounded-lg">
              <span className="text-rig-neon text-sm font-mono">$RIG</span>
              <span className="text-rig-silver text-sm">≈ $0.00</span>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Block Selector + Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BlockSelector
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
            />
          </div>
          <div>
            <ExplorationTimer
              phase={phase}
              timeRemaining={timeRemaining}
              exploration={exploration}
            />
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Rig Grid - 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-rig-charcoal rounded-xl p-6 border border-rig-steel">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-rig-silver">
                  SELECT YOUR RIG
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rig-neon animate-pulse" />
                    <span className="text-sm text-rig-chrome">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rig-gold" />
                    <span className="text-sm text-rig-chrome">Your Deposit</span>
                  </div>
                </div>
              </div>

              <RigGrid
                rigs={rigs}
                winningRig={exploration?.winningRig ?? null}
                onRigClick={handleRigClick}
                disabled={phase !== 'active'}
              />

              {/* Pool Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-rig-steel/50 rounded-lg p-4">
                  <p className="text-xs text-rig-chrome mb-1">Total Pool</p>
                  <p className="text-xl font-mono text-rig-gold">
                    {exploration
                      ? (Number(exploration.totalDeposits) / 1e9).toFixed(2)
                      : '0.00'}{' '}
                    SOL
                  </p>
                </div>
                <div className="bg-rig-steel/50 rounded-lg p-4">
                  <p className="text-xs text-rig-chrome mb-1">Rollover</p>
                  <p className="text-xl font-mono text-rig-electric">
                    {exploration
                      ? (Number(exploration.rolloverAmount) / 1e9).toFixed(2)
                      : '0.00'}{' '}
                    SOL
                  </p>
                </div>
                <div className="bg-rig-steel/50 rounded-lg p-4">
                  <p className="text-xs text-rig-chrome mb-1">Participants</p>
                  <p className="text-xl font-mono text-rig-neon">
                    {rigs.reduce((acc, r) => acc + (r?.depositCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <UserDeposits blockId={selectedBlock} />
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8">
          <ExplorationHistory blockId={selectedBlock} />
        </div>
      </main>

      {/* Deposit Modal */}
      <AnimatePresence>
        {isDepositModalOpen && selectedRig !== null && (
          <DepositModal
            blockId={selectedBlock}
            rigIndex={selectedRig}
            exploration={exploration}
            onClose={() => {
              setIsDepositModalOpen(false);
              setSelectedRig(null);
            }}
            onSuccess={handleDepositSuccess}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-rig-steel bg-rig-charcoal/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-rig-gold font-display text-xl">RIG IT</span>
              <span className="text-rig-chrome text-sm">|</span>
              <span className="text-rig-chrome text-sm">Built on Solana</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-rig-chrome">
              <a href="#" className="hover:text-rig-gold transition-colors">
                Docs
              </a>
              <a href="#" className="hover:text-rig-gold transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-rig-gold transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
