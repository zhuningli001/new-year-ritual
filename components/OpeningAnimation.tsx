'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '@/lib/constants/content';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // 确保onComplete被调用
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 300); // 等待淡出动画完成
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-cream-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-deepRed-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chineseBlue-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <div className="relative text-center space-y-8 px-5 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-deepRed-500 mb-4 tracking-tight leading-[1.1]"
          >
            {CONTENT.title.zh.main}
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-px w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-deepRed-300 to-transparent"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl lg:text-3xl text-chineseBlue-500 mb-2 font-light tracking-wide"
          >
            {CONTENT.title.en.main}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-xl text-chineseBlue-400 font-light"
          >
            {CONTENT.title.zh.sub} / {CONTENT.title.en.sub}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8"
        >
          <div className="inline-block px-6 py-3 bg-deepRed-50/80 border border-deepRed-200/50 rounded-full backdrop-blur-sm">
            <p className="text-sm md:text-base text-deepRed-600 font-light">
              {CONTENT.host.greeting.zh}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
