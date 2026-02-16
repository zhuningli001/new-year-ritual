'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PaymentQRCodeProps {
  amount: number;
  onPaymentMethodChange?: (method: 'wechat' | 'alipay') => void;
}

type PaymentMethod = 'wechat' | 'alipay';

export default function PaymentQRCode({ amount, onPaymentMethodChange }: PaymentQRCodeProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('wechat');
  const [imageError, setImageError] = useState<{ wechat: boolean; alipay: boolean }>({
    wechat: false,
    alipay: false,
  });
  const [saved, setSaved] = useState(false);

  const handleMethodChange = (method: PaymentMethod) => {
    setActiveMethod(method);
    onPaymentMethodChange?.(method);
    setSaved(false);
  };

  // 保存二维码图片
  const handleSaveQRCode = async () => {
    const imageSrc = activeMethod === 'wechat' 
      ? '/qr-codes/wechat-qr.png' 
      : '/qr-codes/alipay-qr.png';
    
    try {
      // 获取完整URL
      const fullImageUrl = `${window.location.origin}${imageSrc}`;
      
      // 使用fetch获取图片
      const response = await fetch(fullImageUrl);
      if (!response.ok) {
        throw new Error('图片加载失败');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeMethod === 'wechat' ? '微信' : '支付宝'}收款码-${amount.toFixed(2)}元.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // 延迟清理，确保下载完成
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('保存二维码失败:', error);
      // 降级方案：提示用户长按保存
      alert('保存失败，请长按二维码图片手动保存到相册');
    }
  };

  // 打开微信/支付宝
  const handleOpenApp = () => {
    if (activeMethod === 'wechat') {
      // 尝试打开微信
      window.location.href = 'weixin://';
      // 如果微信未安装，提示用户
      setTimeout(() => {
        alert('如果未自动打开微信，请手动打开微信扫一扫功能');
      }, 1000);
    } else {
      // 尝试打开支付宝
      window.location.href = 'alipays://';
      // 如果支付宝未安装，提示用户
      setTimeout(() => {
        alert('如果未自动打开支付宝，请手动打开支付宝扫一扫功能');
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-2"
      >
        <h3 className="text-xl md:text-2xl font-light text-deepRed-600">
          扫码收款
        </h3>
        <p className="text-sm md:text-base text-charcoal-500 font-light">
          请使用以下方式支付 <span className="text-deepRed-500 font-medium">¥{amount.toFixed(2)}</span>
        </p>
      </motion.div>

      {/* 支付方式切换 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3 justify-center"
      >
        <motion.button
          onClick={() => handleMethodChange('wechat')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            activeMethod === 'wechat'
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300 border border-cream-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">💚</span>
            <span>微信</span>
          </span>
        </motion.button>
        <motion.button
          onClick={() => handleMethodChange('alipay')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            activeMethod === 'alipay'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300 border border-cream-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">💙</span>
            <span>支付宝</span>
          </span>
        </motion.button>
      </motion.div>

      {/* 二维码展示区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative bg-gradient-to-br from-white to-cream-50 p-6 md:p-8 rounded-2xl shadow-xl border-2 border-cream-300">
            {/* 二维码图片 */}
            <div 
              className="w-64 h-64 md:w-72 md:h-72 bg-white rounded-xl flex items-center justify-center border-2 border-cream-200 shadow-inner overflow-hidden"
              onContextMenu={(e) => {
                // 允许右键保存（桌面端）
                e.preventDefault();
                handleSaveQRCode();
              }}
            >
              {activeMethod === 'wechat' ? (
                imageError.wechat ? (
                  <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                    <div className="text-5xl mb-4">💚</div>
                    <p className="text-xs md:text-sm text-charcoal-500 leading-relaxed px-4">
                      请将微信收款二维码图片<br/>
                      放置在 <code className="bg-cream-200 px-2 py-1 rounded text-xs">public/qr-codes/wechat-qr.png</code>
                    </p>
                  </div>
                ) : (
                  <Image
                    src="/qr-codes/wechat-qr.png"
                    alt="微信收款二维码"
                    width={288}
                    height={288}
                    className="rounded-lg w-full h-full object-contain"
                    onError={() => setImageError({ ...imageError, wechat: true })}
                    priority
                  />
                )
              ) : (
                imageError.alipay ? (
                  <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                    <div className="text-5xl mb-4">💙</div>
                    <p className="text-xs md:text-sm text-charcoal-500 leading-relaxed px-4">
                      请将支付宝收款二维码图片<br/>
                      放置在 <code className="bg-cream-200 px-2 py-1 rounded text-xs">public/qr-codes/alipay-qr.png</code>
                    </p>
                  </div>
                ) : (
                  <Image
                    src="/qr-codes/alipay-qr.png"
                    alt="支付宝收款二维码"
                    width={288}
                    height={288}
                    className="rounded-lg w-full h-full object-contain"
                    onError={() => setImageError({ ...imageError, alipay: true })}
                    priority
                  />
                )
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 w-full max-w-sm"
          >
            {/* 保存二维码按钮 */}
            {!imageError[activeMethod] && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveQRCode}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-deepRed-500 text-white hover:bg-deepRed-600 shadow-md hover:shadow-lg'
                }`}
              >
                {saved ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>已保存到相册</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>📥</span>
                    <span>保存二维码到相册</span>
                  </span>
                )}
              </motion.button>
            )}

            {/* 打开App按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenApp}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeMethod === 'wechat'
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{activeMethod === 'wechat' ? '💚' : '💙'}</span>
                <span>打开{activeMethod === 'wechat' ? '微信' : '支付宝'}扫一扫</span>
              </span>
            </motion.button>
          </motion.div>

          {/* 支付说明 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2 max-w-sm"
          >
            <p className="text-sm md:text-base text-charcoal-600 font-light">
              {saved 
                ? '✅ 二维码已保存！请打开微信/支付宝扫一扫，从相册选择二维码扫描'
                : activeMethod === 'wechat' 
                  ? '💡 提示：保存二维码后，可在同一手机上用微信扫描。也可以长按二维码图片保存'
                  : '💡 提示：保存二维码后，可在同一手机上用支付宝扫描。也可以长按二维码图片保存'}
            </p>
            <p className="text-xs text-charcoal-400 font-light">
              支付完成后，请联系宁莉确认收款
            </p>
            {/* 移动端提示 */}
            <p className="text-xs text-charcoal-300 font-light mt-2">
              💡 移动端：长按二维码图片可直接保存
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
