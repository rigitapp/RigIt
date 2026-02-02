/**
 * Timing utilities for exploration phases
 */

export const DEFAULT_TIMING = {
  ACTIVE_DURATION_SECS: 7200,      // 2 hours
  COOLDOWN_DURATION_SECS: 2400,    // 40 minutes
  ANTI_SNIPE_WINDOW_SECS: 300,     // 5 minutes
  EXPLORATIONS_PER_DAY: 9,
  TOTAL_CYCLE_SECS: 9600,          // 2h 40m
};

export interface ExplorationTiming {
  startTs: number;
  activeEndTs: number;
  cooldownEndTs: number;
  antiSnipeStartTs: number;
}

export function calculateExplorationTiming(
  startTs: number,
  activeDuration: number = DEFAULT_TIMING.ACTIVE_DURATION_SECS,
  cooldownDuration: number = DEFAULT_TIMING.COOLDOWN_DURATION_SECS,
  antiSnipeWindow: number = DEFAULT_TIMING.ANTI_SNIPE_WINDOW_SECS
): ExplorationTiming {
  const activeEndTs = startTs + activeDuration;
  const cooldownEndTs = activeEndTs + cooldownDuration;
  const antiSnipeStartTs = activeEndTs - antiSnipeWindow;

  return {
    startTs,
    activeEndTs,
    cooldownEndTs,
    antiSnipeStartTs,
  };
}

export type ExplorationPhase = 'active' | 'anti_snipe' | 'cooldown' | 'ended';

export function getCurrentPhase(
  currentTs: number,
  timing: ExplorationTiming
): ExplorationPhase {
  if (currentTs < timing.antiSnipeStartTs) {
    return 'active';
  }
  if (currentTs < timing.activeEndTs) {
    return 'anti_snipe';
  }
  if (currentTs < timing.cooldownEndTs) {
    return 'cooldown';
  }
  return 'ended';
}

export function getTimeRemaining(
  currentTs: number,
  timing: ExplorationTiming
): {
  phase: ExplorationPhase;
  secondsRemaining: number;
  formatted: string;
} {
  const phase = getCurrentPhase(currentTs, timing);
  let secondsRemaining: number;

  switch (phase) {
    case 'active':
      secondsRemaining = timing.antiSnipeStartTs - currentTs;
      break;
    case 'anti_snipe':
      secondsRemaining = timing.activeEndTs - currentTs;
      break;
    case 'cooldown':
      secondsRemaining = timing.cooldownEndTs - currentTs;
      break;
    default:
      secondsRemaining = 0;
  }

  return {
    phase,
    secondsRemaining: Math.max(0, secondsRemaining),
    formatted: formatDuration(Math.max(0, secondsRemaining)),
  };
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function getNextExplorationStartTime(
  lastCooldownEndTs: number
): number {
  // Next exploration starts immediately after cooldown
  return lastCooldownEndTs;
}

export function getExplorationIndexForTime(
  protocolStartTs: number,
  currentTs: number,
  cycleDuration: number = DEFAULT_TIMING.TOTAL_CYCLE_SECS
): number {
  if (currentTs < protocolStartTs) return 0;
  return Math.floor((currentTs - protocolStartTs) / cycleDuration);
}

/**
 * Calculate all exploration start times for a day
 */
export function getDailyExplorationSchedule(
  dayStartTs: number,
  count: number = DEFAULT_TIMING.EXPLORATIONS_PER_DAY,
  cycleDuration: number = DEFAULT_TIMING.TOTAL_CYCLE_SECS
): ExplorationTiming[] {
  const schedule: ExplorationTiming[] = [];
  let currentStart = dayStartTs;

  for (let i = 0; i < count; i++) {
    schedule.push(calculateExplorationTiming(currentStart));
    currentStart += cycleDuration;
  }

  return schedule;
}
