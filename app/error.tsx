'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="text-6xl md:text-7xl mb-4">😔</div>
        <h2 className="text-3xl md:text-4xl font-light text-deepRed-500">
          出错了
        </h2>
        <p className="text-charcoal-600 font-light">
          {error.message || '发生了意外错误，请稍后重试'}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="bg-deepRed-500 text-cream-50 px-6 py-3 rounded-xl hover:bg-deepRed-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            重试
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-block border-2 border-deepRed-200 text-deepRed-500 px-6 py-3 rounded-xl hover:bg-deepRed-50 transition-all duration-300 font-medium"
            >
              返回首页
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
