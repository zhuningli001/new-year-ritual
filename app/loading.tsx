'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl md:text-6xl mb-4"
        >
          🐎
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-deepRed-500 font-light text-lg"
        >
          加载中...
        </motion.p>
      </motion.div>
    </main>
  );
}
