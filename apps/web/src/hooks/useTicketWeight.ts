'use client';

import { useMemo } from 'react';
import { estimateTicketWeight } from '@rig-it/sdk';

interface TicketWeightResult {
  baseTickets: number;
  multiplier: number;
  effectiveTickets: number;
}

export function useTicketWeight(
  depositAmount: number,
  rigBalance: number = 0
): TicketWeightResult {
  return useMemo(() => {
    if (depositAmount <= 0) {
      return {
        baseTickets: 0,
        multiplier: 1,
        effectiveTickets: 0,
      };
    }

    return estimateTicketWeight(depositAmount, rigBalance);
  }, [depositAmount, rigBalance]);
}
