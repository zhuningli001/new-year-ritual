'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PaymentStatus as PaymentStatusType } from '@/lib/types';
import { getPaymentStatus, savePaymentStatus, getPaymentRecord, savePaymentRecord } from '@/lib/utils/user';

interface PaymentStatusProps {
  amount: number;
  paymentMethod?: 'wechat' | 'alipay';
}

export default function PaymentStatusComponent({ amount, paymentMethod = 'wechat' }: PaymentStatusProps) {
  const [status, setStatus] = useState<PaymentStatusType>('pending');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const savedStatus = getPaymentStatus();
    if (savedStatus) {
      setStatus(savedStatus);
    }
  }, []);

  const handleMarkAsPaid = () => {
    const newStatus: PaymentStatusType = 'paid';
    setStatus(newStatus);
    savePaymentStatus(newStatus, paymentMethod);
    
    // 保存支付记录
    const record = {
      id: `payment_${Date.now()}`,
      amount,
      method: paymentMethod,
      status: newStatus,
      paidAt: new Date().toISOString(),
    };
    savePaymentRecord(record);
    
    setShowConfirm(false);
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'paid':
        return {
          text: '已支付',
          description: '支付已完成，等待确认',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '✓',
        };
      case 'confirmed':
        return {
          text: '已确认',
          description: '收款已确认',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: '✓',
        };
      default:
        return {
          text: '待支付',
          description: '请扫描二维码完成支付',
          color: 'text-charcoal-600',
          bgColor: 'bg-cream-100',
          borderColor: 'border-cream-300',
          icon: '⏳',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="w-full space-y-4">
      {/* 支付状态卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 md:p-5`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <p className={`${config.color} font-medium text-base md:text-lg`}>
                {config.text}
              </p>
              <p className="text-sm text-charcoal-500 font-light">
                {config.description}
              </p>
            </div>
          </div>
          
          {status === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-deepRed-500 text-white rounded-lg hover:bg-deepRed-600 transition-colors text-sm font-medium shadow-md"
            >
              标记已支付
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 确认对话框 */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-medium text-deepRed-600 mb-4">
              确认支付
            </h3>
            <p className="text-charcoal-600 mb-6 font-light">
              请确认你已经完成支付 ¥{amount.toFixed(2)}。支付完成后，请联系宁莉确认收款。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMarkAsPaid}
                className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                确认已支付
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-cream-300 text-charcoal-600 rounded-lg hover:bg-cream-100 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
