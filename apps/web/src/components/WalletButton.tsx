'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

export const WalletButton: FC = () => {
  const { connected, publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [isHovered, setIsHovered] = useState(false);

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <motion.button
        onClick={() => disconnect()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center gap-2 px-10 py-6 bg-[#010101] border-4 border-[#BEFE46] transition-all"
        whileTap={{ scale: 0.98 }}
      >
        {/* Icon - changes based on hover state */}
        {isHovered ? (
          // Hover state - simple arrow
          <svg
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M6.22222 8.88889L5 7.6L7.26667 5.33333H0V3.55556H7.26667L5 1.28889L6.22222 0L10.6667 4.44444L6.22222 8.88889Z"
              fill="#BEFE46"
            />
          </svg>
        ) : (
          // Default state - exit icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M0 16V0H8V1.77778H1.77778V14.2222H8V16H0ZM11.5556 12.4444L10.3333 11.1556L12.6 8.88889H5.33333V7.11111H12.6L10.3333 4.84444L11.5556 3.55556L16 8L11.5556 12.4444Z"
              fill="#BEFE46"
            />
          </svg>
        )}

        {/* Text */}
        <span className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-base font-normal">
          DISCONNECT {truncatedAddress}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="px-6 py-2 bg-gold-gradient rounded-lg font-semibold text-rig-black hover:shadow-lg hover:shadow-rig-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: connecting ? 1 : 1.02 }}
      whileTap={{ scale: connecting ? 1 : 0.98 }}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </motion.button>
  );
};
