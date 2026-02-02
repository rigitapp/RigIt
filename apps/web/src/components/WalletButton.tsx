'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

export const WalletButton: FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-rig-steel rounded-lg text-sm text-rig-silver hover:bg-rig-iron transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="hidden sm:inline">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
          <span className="sm:hidden">
            {publicKey.toBase58().slice(0, 4)}...
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => setVisible(true)}
      className="px-6 py-2 bg-gold-gradient rounded-lg font-semibold text-rig-black hover:shadow-lg hover:shadow-rig-gold/30 transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Connect Wallet
    </motion.button>
  );
};
