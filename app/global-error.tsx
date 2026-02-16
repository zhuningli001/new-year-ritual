'use client';

import { motion } from 'framer-motion';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="text-6xl md:text-7xl mb-4">⚠️</div>
            <h2 className="text-3xl md:text-4xl font-light text-deepRed-500">
              系统错误
            </h2>
            <p className="text-charcoal-600 font-light">
              {error.message || '发生了严重错误，请刷新页面重试'}
            </p>
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="bg-deepRed-500 text-cream-50 px-8 py-3 rounded-xl hover:bg-deepRed-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                重试
              </motion.button>
            </div>
          </motion.div>
        </main>
      </body>
    </html>
  );
}
