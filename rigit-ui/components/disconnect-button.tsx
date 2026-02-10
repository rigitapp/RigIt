'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DisconnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  walletAddress?: string
}

export function DisconnectButton({ 
  walletAddress = '6ZXc...gkU',
  className,
  ...props 
}: DisconnectButtonProps) {
  return (
    <button
      className={cn(
        'group inline-flex items-center justify-center gap-2 px-10 py-6 bg-[#010101] border-4 border-[#BEFE46] cursor-pointer transition-all',
        className
      )}
      {...props}
    >
      {/* Default Icon - shown by default, hidden on hover */}
      <svg 
        className="shrink-0 group-hover:hidden"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0 16V0H8V1.77778H1.77778V14.2222H8V16H0ZM11.5556 12.4444L10.3333 11.1556L12.6 8.88889H5.33333V7.11111H12.6L10.3333 4.84444L11.5556 3.55556L16 8L11.5556 12.4444Z" 
          fill="#BEFE46"
        />
      </svg>
      
      {/* Hover Icon - hidden by default, shown on hover */}
      <svg 
        className="shrink-0 hidden group-hover:block"
        width="11" 
        height="9" 
        viewBox="0 0 11 9" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M6.22222 8.88889L5 7.6L7.26667 5.33333H0V3.55556H7.26667L5 1.28889L6.22222 0L10.6667 4.44444L6.22222 8.88889Z" 
          fill="#BEFE46"
        />
      </svg>
      
      <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-normal leading-normal">
        DISCONNECT {walletAddress}
      </span>
    </button>
  )
}
