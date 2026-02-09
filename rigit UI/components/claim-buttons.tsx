'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type ClaimType = 'winnings' | 'refunds'

interface ClaimButtonsProps {
  onClaimWinnings?: () => void
  onClaimRefunds?: () => void
  defaultActive?: ClaimType
  className?: string
}

export function ClaimButtons({
  onClaimWinnings,
  onClaimRefunds,
  defaultActive = 'winnings',
  className,
}: ClaimButtonsProps) {
  const [activeButton, setActiveButton] = useState<ClaimType>(defaultActive)

  const handleWinningsClick = () => {
    setActiveButton('winnings')
    onClaimWinnings?.()
  }

  const handleRefundsClick = () => {
    setActiveButton('refunds')
    onClaimRefunds?.()
  }

  const isWinningsActive = activeButton === 'winnings'
  const isRefundsActive = activeButton === 'refunds'

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <button
        onClick={handleWinningsClick}
        className={cn(
          'w-full py-6 px-8 text-[22px] font-normal leading-normal uppercase tracking-wide border-4 font-mono button-zoom',
          isWinningsActive ? 'claim-button-active' : 'claim-button-inactive'
        )}
      >
        <span>Claim Winnings</span>
      </button>

      <button
        onClick={handleRefundsClick}
        className={cn(
          'w-full py-6 px-8 text-[22px] font-normal leading-normal uppercase tracking-wide border-4 font-mono button-zoom',
          isRefundsActive ? 'claim-button-active' : 'claim-button-inactive'
        )}
      >
        <span>Claim Refunds</span>
      </button>
    </div>
  )
}
