'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { DrawResult } from '@/lib/types';
import HostSignature from '@/components/HostSignature';
import ShareButton from '@/components/ShareButton';
import PaymentQRCode from '@/components/PaymentQRCode';
import PaymentStatusComponent from '@/components/PaymentStatus';
import { CONTENT } from '@/lib/constants/content';
import { getDrawResult } from '@/lib/utils/user';

// 禁用静态生成，避免framer-motion构建错误
export const dynamic = 'force-dynamic';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const hasProcessed = useRef(false); // 防止重复处理

  useEffect(() => {
    // 如果已经处理过，不再执行
    if (hasProcessed.current) {
      return;
    }

    // 优先从localStorage读取保存的结果
    const savedResult = getDrawResult();
    
    if (savedResult) {
      // 如果有保存的结果，使用保存的结果
      setResult(savedResult as DrawResult);
      setLoading(false);
      hasProcessed.current = true;
      return;
    }

    // 如果没有保存的结果，从URL参数读取
    const type = searchParams.get('type');
    const amount = searchParams.get('amount');
    const blessingId = searchParams.get('blessingId');

    // 如果没有任何参数，延迟检查（等待 searchParams 加载）
    if (!type && !amount && !blessingId) {
      const timer = setTimeout(() => {
        const retryType = searchParams.get('type');
        const retryAmount = searchParams.get('amount');
        const retryBlessingId = searchParams.get('blessingId');
        
        if (!retryType && !retryAmount && !retryBlessingId && !hasProcessed.current) {
          hasProcessed.current = true;
          router.replace('/');
        } else if (retryType || retryAmount || retryBlessingId) {
          // 如果有参数，重新处理
          hasProcessed.current = false;
        } else {
          setLoading(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }

    if (type === 'redpacket' && amount) {
      setResult({
        type: 'redpacket',
        amount: parseFloat(amount),
      });
      setLoading(false);
      hasProcessed.current = true;
    } else if (type === 'blessing' && blessingId) {
      // MVP版本：基于blessingId生成稳定的祝福语
      // blessingId格式：blessing-xxxxx，使用后8位生成索引
      let blessingContent: string = CONTENT.blessings[0];
      if (blessingId.startsWith('blessing-')) {
        const idSuffix = blessingId.slice(-8);
        const blessingIndex = parseInt(idSuffix, 36) % CONTENT.blessings.length;
        blessingContent = CONTENT.blessings[blessingIndex] as string;
      }
      
      setResult({
        type: 'blessing',
        blessing: {
          id: blessingId,
          type: 'text',
          content: blessingContent,
        },
      });
      setLoading(false);
      hasProcessed.current = true;
    } else {
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="text-deepRed-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <>
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50">
      <div className="container mx-auto px-5 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {result.type === 'redpacket' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-gradient-to-br from-cream-50 to-gold-50 border-2 border-gold-200 rounded-3xl p-8 md:p-14 shadow-xl text-center space-y-10 overflow-hidden"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-deepRed-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-deepRed-600 text-lg md:text-xl font-light"
                >
                  宁莉祝你新年快乐
                </motion.p>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-7xl md:text-8xl"
                >
                  🧧
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold-600 tracking-tight"
                >
                  ¥{result.amount?.toFixed(2)}
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-charcoal-600 text-base md:text-lg font-light"
                >
                  恭喜获得红包！
                </motion.p>
              </div>

              <div className="relative pt-8 border-t border-gold-300/50 space-y-6">
                {/* 支付状态组件 */}
                <PaymentStatusComponent 
                  amount={result.amount || 0} 
                  paymentMethod={paymentMethod}
                />
                
                {/* 支付二维码组件 */}
                <PaymentQRCode 
                  amount={result.amount || 0} 
                  onPaymentMethodChange={setPaymentMethod}
                />
              </div>

              <div className="relative space-y-5 pt-8">
                <div className="flex justify-center">
                  <ShareButton resultType="redpacket" resultAmount={result.amount} />
                </div>
                <div className="flex gap-6 justify-center flex-wrap">
                  <button
                    onClick={() => router.push('/wall')}
                    className="text-deepRed-500 hover:text-chineseBlue-500 transition-colors underline text-sm md:text-base font-light"
                  >
                    查看祝福墙
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="text-deepRed-500 hover:text-chineseBlue-500 transition-colors underline text-sm md:text-base font-light"
                  >
                    返回首页
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-gradient-to-br from-cream-50 to-chineseBlue-50 border-2 border-chineseBlue-200 rounded-3xl p-8 md:p-14 shadow-xl text-center space-y-10 overflow-hidden"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-chineseBlue-200/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-deepRed-200/20 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
              
              <div className="relative space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-deepRed-600 text-lg md:text-xl font-light"
                >
                  来自宁莉的祝福
                </motion.p>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  className="text-7xl md:text-8xl"
                >
                  🐎
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-charcoal-700 text-lg md:text-xl lg:text-2xl leading-relaxed font-light max-w-2xl mx-auto px-4"
                >
                  {result.blessing?.content || '新年快乐！愿你在2026年马年，马上有福，马到成功！'}
                </motion.p>
              </div>

              <div className="relative space-y-5 pt-8">
                <div className="flex justify-center">
                  <ShareButton resultType="blessing" />
                </div>
                <div className="flex gap-6 justify-center flex-wrap">
                  <button
                    onClick={() => router.push('/wall')}
                    className="text-deepRed-500 hover:text-chineseBlue-500 transition-colors underline text-sm md:text-base font-light"
                  >
                    查看祝福墙
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="text-deepRed-500 hover:text-chineseBlue-500 transition-colors underline text-sm md:text-base font-light"
                  >
                    返回首页
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-16">
            <HostSignature />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-deepRed-500">加载中...</p>
        </div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
