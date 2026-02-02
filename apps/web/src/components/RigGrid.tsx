'use client';

import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RigState, RIGS_PER_EXPLORATION } from '@rig-it/sdk';

interface RigGridProps {
  rigs: (RigState | null)[];
  winningRig: number | null;
  onRigClick: (rigIndex: number) => void;
  disabled?: boolean;
  userDeposits?: Map<number, bigint>; // rigIndex -> deposit amount
}

export const RigGrid: FC<RigGridProps> = ({
  rigs,
  winningRig,
  onRigClick,
  disabled = false,
  userDeposits = new Map(),
}) => {
  // Find max deposits for relative sizing
  const maxDeposits = useMemo(() => {
    return Math.max(
      ...rigs.map((r) => Number(r?.totalDeposits || 0)),
      1 // Avoid division by zero
    );
  }, [rigs]);

  // Generate 36 rig cells
  const rigCells = useMemo(() => {
    return Array.from({ length: RIGS_PER_EXPLORATION }, (_, i) => {
      const rig = rigs[i];
      const deposits = Number(rig?.totalDeposits || 0);
      const tickets = Number(rig?.totalTickets || 0);
      const fillPercent = (deposits / maxDeposits) * 100;
      const isWinner = winningRig === i;
      const hasUserDeposit = userDeposits.has(i);

      return {
        index: i,
        deposits,
        tickets,
        fillPercent,
        isWinner,
        hasUserDeposit,
        depositCount: rig?.depositCount || 0,
      };
    });
  }, [rigs, maxDeposits, winningRig, userDeposits]);

  return (
    <div className="grid grid-cols-6 gap-2 md:gap-3">
      {rigCells.map((rig) => (
        <motion.button
          key={rig.index}
          onClick={() => !disabled && onRigClick(rig.index)}
          disabled={disabled}
          className={`
            rig-cell aspect-square rounded-lg border-2 relative
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${rig.isWinner 
              ? 'border-rig-neon winner-glow' 
              : rig.hasUserDeposit 
                ? 'border-rig-gold' 
                : 'border-rig-steel hover:border-rig-chrome'
            }
            bg-rig-steel/30
          `}
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          {/* Fill indicator */}
          <div
            className={`
              absolute bottom-0 left-0 right-0 transition-all duration-500
              ${rig.isWinner ? 'bg-rig-neon/30' : 'bg-rig-gold/20'}
            `}
            style={{ height: `${rig.fillPercent}%` }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-1">
            <span
              className={`
                font-display text-lg md:text-xl
                ${rig.isWinner 
                  ? 'text-rig-neon glow-text' 
                  : rig.hasUserDeposit 
                    ? 'text-rig-gold' 
                    : 'text-rig-chrome'
                }
              `}
            >
              {rig.index + 1}
            </span>

            {rig.deposits > 0 && (
              <span className="text-xs text-rig-silver font-mono mt-1 truncate w-full text-center">
                {(rig.deposits / 1e9).toFixed(2)}
              </span>
            )}
          </div>

          {/* Winner badge */}
          {rig.isWinner && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-rig-neon rounded-full flex items-center justify-center"
            >
              <span className="text-sm">🏆</span>
            </motion.div>
          )}

          {/* User deposit indicator */}
          {rig.hasUserDeposit && !rig.isWinner && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rig-gold rounded-full" />
          )}

          {/* Participant count */}
          {rig.depositCount > 0 && (
            <div className="absolute bottom-1 right-1 text-xs text-rig-chrome font-mono">
              {rig.depositCount}
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
};
