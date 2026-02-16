'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '@/lib/constants/content';

interface ShareButtonProps {
  resultType?: 'redpacket' | 'blessing';
  resultAmount?: number;
  className?: string;
}

export default function ShareButton({ resultType, resultAmount, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = resultType === 'redpacket' 
      ? `${CONTENT.share.zh} 我抽到了¥${resultAmount?.toFixed(2)}的红包！`
      : CONTENT.share.zh;
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

    // 使用Web Share API（如果支持）
    if (navigator.share) {
      try {
        await navigator.share({
          title: CONTENT.title.zh.full,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // 用户取消分享，忽略错误
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }

    // 降级到复制链接
    const fullText = `${shareText}\n${shareUrl}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        fallbackCopy(fullText);
      }
    } else {
      fallbackCopy(fullText);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Fallback copy failed:', error);
      alert('请手动复制链接：' + text);
    }
    document.body.removeChild(textArea);
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-2.5 px-7 py-3.5 bg-chineseBlue-500 text-cream-50 rounded-xl hover:bg-chineseBlue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-chineseBlue-500/30 border border-chineseBlue-600/20 ${className}`}
    >
      <motion.span
        animate={copied ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {copied ? '✓' : '🔗'}
      </motion.span>
      <span>{copied ? '已复制' : '分享祝福'}</span>
      {copied && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
        />
      )}
    </motion.button>
  );
}
