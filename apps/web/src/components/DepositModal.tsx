'use client';

import { FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import type { ExplorationState } from '@rig-it/sdk';
import { estimateTicketWeight } from '@rig-it/sdk';

interface DepositModalProps {
  blockId: number;
  rigIndex: number;
  exploration: ExplorationState | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: FC<DepositModalProps> = ({
  blockId,
  rigIndex,
  exploration,
  onClose,
  onSuccess,
}) => {
  const { connected, publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock $RIG balance - in production, fetch from chain
  const rigBalance = 0;

  const ticketEstimate = useMemo(() => {
    const amountLamports = parseFloat(amount || '0') * 1e9;
    if (amountLamports <= 0) return null;
    return estimateTicketWeight(amountLamports, rigBalance);
  }, [amount, rigBalance]);

  const handleDeposit = async () => {
    if (!connected || !publicKey || !amount) return;

    setIsLoading(true);
    try {
      // In production, call RigItClient.depositToRig()
      console.log('Depositing', {
        blockId,
        rigIndex,
        amount: parseFloat(amount) * 1e9,
      });

      // Simulate delay
      await new Promise((r) => setTimeout(r, 1500));

      onSuccess();
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [0.1, 0.5, 1, 5];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-rig-charcoal rounded-2xl border border-rig-steel max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-rig-gold">
              DEPOSIT TO RIG #{rigIndex + 1}
            </h2>
            <p className="text-sm text-rig-chrome mt-1">
              Exploration #{exploration?.explorationIndex?.toString() || '—'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rig-steel flex items-center justify-center hover:bg-rig-iron transition-colors"
          >
            <span className="text-rig-chrome">✕</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-sm text-rig-chrome mb-2 block">Amount (SOL)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-rig-steel rounded-xl p-4 text-2xl font-mono text-rig-gold placeholder:text-rig-chrome/50 focus:outline-none focus:ring-2 focus:ring-rig-gold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rig-chrome">
              SOL
            </span>
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="flex gap-2 mb-6">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              className="flex-1 py-2 rounded-lg bg-rig-steel hover:bg-rig-iron transition-colors text-sm text-rig-silver"
            >
              {preset} SOL
            </button>
          ))}
        </div>

        {/* Ticket Estimate */}
        {ticketEstimate && (
          <div className="bg-rig-steel/50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-rig-chrome">Base Tickets</span>
              <span className="font-mono text-rig-silver">
                {ticketEstimate.baseTickets.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-rig-chrome">$RIG Multiplier</span>
              <span className="font-mono text-rig-electric">
                {ticketEstimate.multiplier.toFixed(2)}x
              </span>
            </div>
            <div className="border-t border-rig-steel pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-rig-gold">Effective Tickets</span>
                <span className="font-mono text-rig-gold text-lg">
                  {ticketEstimate.effectiveTickets.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* $RIG Bonus Info */}
        <div className="bg-rig-gold/10 rounded-xl p-4 mb-6 border border-rig-gold/30">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm text-rig-gold font-medium">
                Hold $RIG for bonus tickets!
              </p>
              <p className="text-xs text-rig-chrome mt-1">
                Your $RIG balance: {rigBalance.toLocaleString()} tokens
                <br />
                Multiplier: {ticketEstimate?.multiplier?.toFixed(2) || '1.00'}x (max
                3.00x)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-rig-steel text-rig-chrome hover:bg-rig-steel transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={!connected || !amount || isLoading}
            className="flex-1 py-3 rounded-xl bg-gold-gradient text-rig-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-rig-gold/30 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⚙️
                </motion.span>
                Processing...
              </span>
            ) : !connected ? (
              'Connect Wallet'
            ) : (
              'Deposit'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
