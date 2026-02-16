import { CONTENT } from '@/lib/constants/content';

/**
 * 红包分配算法（数据库模式）
 * 从预生成的30个红包中分配
 * 注意：此函数用于数据库模式，MVP模式使用 redpacket-pool.ts 中的函数
 */
export function allocateRedPacket(
  remainingAmount: number,
  remainingWinners: number,
): number {
  const { maxAmount, minAmount } = CONTENT.redpacketPool;
  
  if (remainingWinners === 1) {
    return Math.round(remainingAmount * 100) / 100; // 最后一个获得全部
  }

  // 计算平均金额
  const avgAmount = remainingAmount / remainingWinners;
  
  // 随机金额范围：minAmount 到 min(maxAmount, 2 * avgAmount)
  const maxRandom = Math.min(
    maxAmount,
    Math.max(minAmount, 2 * avgAmount),
    remainingAmount - (remainingWinners - 1) * minAmount
  );
  const minRandom = Math.max(
    minAmount,
    remainingAmount - (remainingWinners - 1) * maxAmount
  );

  // 生成随机金额（保留2位小数）
  const amount = Math.random() * (maxRandom - minRandom) + minRandom;
  return Math.floor(amount * 100) / 100;
}
