'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function DrawButton({ onClick, disabled, loading }: DrawButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-deepRed-500 text-cream-50 px-10 py-4.5 rounded-xl
                 hover:bg-deepRed-600 transition-all duration-300
                 shadow-lg hover:shadow-2xl hover:shadow-deepRed-500/30
                 disabled:opacity-50 disabled:cursor-not-allowed
                 font-medium text-lg md:text-xl tracking-wide
                 border border-deepRed-600/20"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ⏳
          </motion.span>
          抽取中...
        </span>
      ) : (
        '抽取新年祝福'
      )}
      
      {/* 深金色微粒效果（hover时） */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50 blur-sm" />
        </motion.div>
      )}
    </motion.button>
  );
}
