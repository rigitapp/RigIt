'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { BLOCK_IDS } from '@rig-it/sdk';

interface Block {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  color: string;
}

const BLOCKS: Block[] = [
  {
    id: BLOCK_IDS.SOL,
    name: 'SOL Block',
    symbol: 'SOL',
    icon: '◎',
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: BLOCK_IDS.PUMP,
    name: 'PUMP Block',
    symbol: 'PUMP',
    icon: '🚀',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: BLOCK_IDS.SKR,
    name: 'SKR Block',
    symbol: 'SKR',
    icon: '💀',
    color: 'from-red-500 to-orange-500',
  },
];

interface BlockSelectorProps {
  selectedBlock: number;
  onSelectBlock: (blockId: number) => void;
}

export const BlockSelector: FC<BlockSelectorProps> = ({
  selectedBlock,
  onSelectBlock,
}) => {
  return (
    <div className="bg-rig-charcoal rounded-xl p-6 border border-rig-steel">
      <h2 className="font-display text-xl text-rig-silver mb-4">SELECT BLOCK</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {BLOCKS.map((block) => {
          const isSelected = selectedBlock === block.id;
          
          return (
            <motion.button
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-rig-gold bg-rig-gold/10' 
                  : 'border-rig-steel bg-rig-steel/30 hover:border-rig-chrome'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  layoutId="blockSelector"
                  className="absolute inset-0 rounded-xl bg-rig-gold/5"
                  transition={{ type: 'spring', damping: 20 }}
                />
              )}
              
              <div className="relative z-10">
                <div
                  className={`
                    w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center
                    bg-gradient-to-br ${block.color}
                  `}
                >
                  <span className="text-2xl">{block.icon}</span>
                </div>
                
                <p className={`
                  font-display text-lg
                  ${isSelected ? 'text-rig-gold' : 'text-rig-silver'}
                `}>
                  {block.name}
                </p>
                
                <p className="text-xs text-rig-chrome font-mono mt-1">
                  {block.symbol}
                </p>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-rig-gold rounded-full flex items-center justify-center"
                >
                  <span className="text-rig-black text-sm">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
