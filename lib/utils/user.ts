import type { PaymentStatus, PaymentRecord } from '@/lib/types';

/**
 * 获取用户标识（设备指纹）
 * 使用localStorage存储用户ID
 */
export function getUserIdentifier(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

/**
 * 检查用户是否已抽取过
 */
export function hasDrawn(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem('draw_result') !== null;
}

/**
 * 获取已保存的抽取结果
 */
export function getDrawResult(): { type: string; [key: string]: any } | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const result = localStorage.getItem('draw_result');
  if (!result) {
    return null;
  }
  try {
    return JSON.parse(result);
  } catch {
    return null;
  }
}

/**
 * 保存抽取结果
 */
export function saveDrawResult(result: { type: string; [key: string]: any }): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('draw_result', JSON.stringify(result));
}

/**
 * 获取支付状态
 */
export function getPaymentStatus(): PaymentStatus | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const status = localStorage.getItem('payment_status');
  return status as PaymentStatus | null;
}

/**
 * 保存支付状态
 */
export function savePaymentStatus(status: PaymentStatus, method?: 'wechat' | 'alipay'): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('payment_status', status);
  if (method) {
    localStorage.setItem('payment_method', method);
  }
  if (status === 'paid') {
    localStorage.setItem('payment_paid_at', new Date().toISOString());
  }
}

/**
 * 获取支付记录
 */
export function getPaymentRecord(): PaymentRecord | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const record = localStorage.getItem('payment_record');
  if (!record) {
    return null;
  }
  try {
    return JSON.parse(record);
  } catch {
    return null;
  }
}

/**
 * 保存支付记录
 */
export function savePaymentRecord(record: PaymentRecord): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('payment_record', JSON.stringify(record));
}
