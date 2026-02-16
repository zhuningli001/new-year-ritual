'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DrawButton from '@/components/DrawButton';
import HostGreeting from '@/components/HostGreeting';
import HostSignature from '@/components/HostSignature';
import { CONTENT } from '@/lib/constants/content';
import { getUserIdentifier, hasDrawn, getDrawResult, saveDrawResult } from '@/lib/utils/user';
import { getRedPacketFromPool, hasRedPacketAvailable } from '@/lib/utils/redpacket-pool';

// 直接导入开场动画（避免动态导入导致的加载问题）
import OpeningAnimation from '@/components/OpeningAnimation';

// 禁用静态生成，避免framer-motion构建错误
export const dynamic = 'force-dynamic';

// 获取随机祝福语
function getRandomBlessing(): string {
  const blessings = CONTENT.blessings;
  const userIdentifier = getUserIdentifier();
  // 基于userIdentifier生成稳定的祝福语索引
  if (userIdentifier.length >= 8) {
    const idSuffix = userIdentifier.slice(-8);
    const blessingIndex = parseInt(idSuffix, 36) % blessings.length;
    return blessings[blessingIndex] as string;
  }
  return blessings[0] as string;
}

export default function Home() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasAlreadyDrawn, setHasAlreadyDrawn] = useState(false);
  const hasRedirected = useRef(false); // 防止重复跳转

  // 检查是否已抽取过
  useEffect(() => {
    // 如果已经跳转过，不再执行
    if (hasRedirected.current) {
      return;
    }

    // 等待动画完成后再检查
    if (!showAnimation) {
      // 使用 setTimeout 确保状态更新完成
      const timer = setTimeout(() => {
        if (hasDrawn()) {
          const savedResult = getDrawResult();
          if (savedResult && !hasRedirected.current) {
            setHasAlreadyDrawn(true);
            hasRedirected.current = true;
            if (savedResult.type === 'redpacket') {
              router.replace(`/result?type=redpacket&amount=${savedResult.amount}`);
            } else {
              router.replace(`/result?type=blessing&blessingId=${savedResult.blessing?.id || 'default'}`);
            }
          }
        }
      }, 100); // 短暂延迟确保状态稳定

      return () => clearTimeout(timer);
    }
  }, [showAnimation, router]);

  const handleDraw = async () => {
    // 如果已抽取过，不允许再次抽取
    if (hasDrawn()) {
      const savedResult = getDrawResult();
      if (savedResult) {
        if (savedResult.type === 'redpacket') {
          router.replace(`/result?type=redpacket&amount=${savedResult.amount}`); // 使用 replace
        } else {
          router.replace(`/result?type=blessing&blessingId=${savedResult.blessing?.id || 'default'}`); // 使用 replace
        }
      }
      return;
    }

    setIsDrawing(true);
    try {
      const userIdentifier = getUserIdentifier();
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdentifier }),
      });

      if (!response.ok) {
        throw new Error('抽取失败');
      }

      let result = await response.json();
      
      // MVP模式：如果抽到红包，从预生成的红包池中分配
      if (result.type === 'redpacket') {
        // 检查红包池是否还有剩余
        if (hasRedPacketAvailable()) {
          const poolAmount = getRedPacketFromPool();
          if (poolAmount > 0) {
            result.amount = poolAmount;
          }
        } else {
          // 红包池已空，改为祝福
          result = {
            type: 'blessing',
            blessing: {
              id: `blessing-${userIdentifier.slice(-8)}`,
              type: 'text',
              content: getRandomBlessing(),
            },
          };
        }
      }
      
      // 保存抽取结果到localStorage
      saveDrawResult(result);
      
      // 跳转到结果页
      if (result.type === 'redpacket') {
        router.replace(`/result?type=redpacket&amount=${result.amount}`); // 使用 replace 避免历史记录堆积
      } else {
        router.replace(`/result?type=blessing&blessingId=${result.blessing?.id || 'default'}`); // 使用 replace
      }
    } catch (error) {
      console.error('Error drawing:', error);
      setIsDrawing(false);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (errorMessage.includes('fetch')) {
        alert('网络错误，请检查网络连接后重试');
      } else {
        alert('抽取失败，请稍后重试');
      }
    }
  };

  if (showAnimation) {
    return <OpeningAnimation onComplete={() => setShowAnimation(false)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50">
      <div className="container mx-auto px-5 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-16 md:space-y-20">
            {/* 主标题区域 - 增强视觉层次 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 md:space-y-8"
            >
              <div className="space-y-5 md:space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-deepRed-500 tracking-tight leading-[1.1]">
                  {CONTENT.title.zh.main}
                </h1>
                <div className="h-px w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-deepRed-300 to-transparent" />
                <p className="text-lg md:text-xl lg:text-2xl text-chineseBlue-500 font-light tracking-wide">
                  {CONTENT.title.en.main}
                </p>
                <p className="text-sm md:text-base lg:text-lg text-chineseBlue-400 font-light">
                  {CONTENT.title.zh.sub} / {CONTENT.title.en.sub}
                </p>
              </div>
            </motion.div>

            {/* 发起人祝福 - 优化样式 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <HostGreeting />
            </motion.div>

            {/* 大量留白 - 增加呼吸感 */}
            <div className="h-12 md:h-20" />

            {/* 抽取按钮区域 - 增强视觉焦点 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-6"
            >
              {hasAlreadyDrawn ? (
                <div className="space-y-5">
                  <p className="text-charcoal-500 text-base md:text-lg font-light">
                    您已经抽取过了
                  </p>
                  <button
                    onClick={() => {
                      const savedResult = getDrawResult();
                      if (savedResult) {
                        if (savedResult.type === 'redpacket') {
                          router.replace(`/result?type=redpacket&amount=${savedResult.amount}`); // 使用 replace
                        } else {
                          router.replace(`/result?type=blessing&blessingId=${savedResult.blessing?.id || 'default'}`); // 使用 replace
                        }
                      }
                    }}
                    className="bg-chineseBlue-500 text-cream-50 px-8 py-3.5 rounded-lg hover:bg-chineseBlue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    查看我的结果
                  </button>
                </div>
              ) : (
                <DrawButton onClick={handleDraw} loading={isDrawing} />
              )}
            </motion.div>

            {/* 大量留白 */}
            <div className="h-12 md:h-20" />

            {/* 发起人签名 - 优化间距 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <HostSignature />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
