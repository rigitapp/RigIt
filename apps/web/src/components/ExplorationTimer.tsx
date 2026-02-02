'use client';

import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ExplorationState } from '@rig-it/sdk';

type Phase = 'active' | 'anti_snipe' | 'cooldown' | 'ended';

interface ExplorationTimerProps {
  phase: Phase;
  timeRemaining: number;
  exploration: ExplorationState | null;
}

export const ExplorationTimer: FC<ExplorationTimerProps> = ({
  phase,
  timeRemaining,
  exploration,
}) => {
  const { hours, minutes, seconds } = useMemo(() => {
    const h = Math.floor(timeRemaining / 3600);
    const m = Math.floor((timeRemaining % 3600) / 60);
    const s = timeRemaining % 60;
    return { hours: h, minutes: m, seconds: s };
  }, [timeRemaining]);

  const phaseConfig = useMemo(() => {
    switch (phase) {
      case 'active':
        return {
          label: 'EXPLORATION ACTIVE',
          color: 'text-rig-neon',
          bgColor: 'bg-rig-neon/10',
          borderColor: 'border-rig-neon',
          icon: '⚙️',
        };
      case 'anti_snipe':
        return {
          label: 'ANTI-SNIPE ACTIVE',
          color: 'text-rig-amber',
          bgColor: 'bg-rig-amber/10',
          borderColor: 'border-rig-amber',
          icon: '🛡️',
        };
      case 'cooldown':
        return {
          label: 'COOLDOWN',
          color: 'text-rig-electric',
          bgColor: 'bg-rig-electric/10',
          borderColor: 'border-rig-electric',
          icon: '❄️',
        };
      default:
        return {
          label: 'ENDED',
          color: 'text-rig-chrome',
          bgColor: 'bg-rig-steel/50',
          borderColor: 'border-rig-steel',
          icon: '🏁',
        };
    }
  }, [phase]);

  return (
    <div className={`bg-rig-charcoal rounded-xl p-6 border ${phaseConfig.borderColor}`}>
      {/* Phase indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{phaseConfig.icon}</span>
          <span className={`font-display text-sm ${phaseConfig.color}`}>
            {phaseConfig.label}
          </span>
        </div>
        {phase === 'active' && (
          <motion.div
            className="w-2 h-2 rounded-full bg-rig-neon"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Countdown */}
      <div className="flex justify-center gap-2 mb-4">
        <TimeSegment value={hours} label="HRS" />
        <div className="text-rig-gold text-3xl font-display">:</div>
        <TimeSegment value={minutes} label="MIN" />
        <div className="text-rig-gold text-3xl font-display">:</div>
        <TimeSegment value={seconds} label="SEC" />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-rig-steel rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${phase === 'active' ? 'bg-rig-neon' : phase === 'anti_snipe' ? 'bg-rig-amber' : 'bg-rig-electric'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeRemaining / getPhaseMaxTime(phase)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Warning for anti-snipe */}
      {phase === 'anti_snipe' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-rig-amber/10 rounded-lg border border-rig-amber/30"
        >
          <p className="text-xs text-rig-amber">
            ⚠️ Deposits made now will roll to the next exploration
          </p>
        </motion.div>
      )}
    </div>
  );
};

interface TimeSegmentProps {
  value: number;
  label: string;
}

const TimeSegment: FC<TimeSegmentProps> = ({ value, label }) => (
  <div className="countdown-segment rounded-lg p-3 min-w-[60px]">
    <div className="text-2xl md:text-3xl font-mono text-rig-gold text-center">
      {value.toString().padStart(2, '0')}
    </div>
    <div className="text-xs text-rig-chrome text-center mt-1">{label}</div>
  </div>
);

function getPhaseMaxTime(phase: Phase): number {
  switch (phase) {
    case 'active':
      return 7200 - 300; // 2 hours minus anti-snipe
    case 'anti_snipe':
      return 300; // 5 minutes
    case 'cooldown':
      return 2400; // 40 minutes
    default:
      return 1;
  }
}
