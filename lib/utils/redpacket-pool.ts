import { CONTENT } from '@/lib/constants/content';

/**
 * 预生成30个红包金额
 * 使用二倍均值法确保公平性和随机性
 */
export function generateRedPacketPool(): number[] {
  const { totalAmount, totalCount, maxAmount, minAmount } = CONTENT.redpacketPool;
  const amounts: number[] = [];
  let remaining: number = totalAmount;

  for (let i = 0; i < totalCount; i++) {
    if (i === totalCount - 1) {
      // 最后一个红包，分配剩余全部金额
      amounts.push(Math.round(remaining * 100) / 100);
      break;
    }

    // 计算当前可分配的最大金额
    // 确保：1. 不超过maxAmount 2. 剩余金额足够分配给剩余人数
    const maxPossible = Math.min(
      maxAmount,
      remaining - (totalCount - i - 1) * minAmount
    );
    
    // 二倍均值法：随机金额在 (minAmount, 2 * 平均值) 之间
    const avg = remaining / (totalCount - i);
    const maxRandom = Math.min(maxPossible, 2 * avg);
    const minRandom = Math.max(minAmount, remaining - (totalCount - i - 1) * maxAmount);

    // 生成随机金额
    const amount = Math.random() * (maxRandom - minRandom) + minRandom;
    const roundedAmount = Math.floor(amount * 100) / 100;
    
    amounts.push(Math.max(minAmount, Math.min(maxAmount, roundedAmount)));
    remaining -= amounts[i];
    
    // 确保剩余金额不为负
    if (remaining < 0) {
      remaining = 0;
    }
  }

  // 验证总和并精确调整
  let sum = amounts.reduce((a, b) => a + b, 0);
  let diff = totalAmount - sum;
  
  // 如果总和有偏差，调整最后一个红包
  if (Math.abs(diff) > 0.001) {
    const adjustedAmount = amounts[amounts.length - 1] + diff;
    // 确保调整后的金额在有效范围内
    amounts[amounts.length - 1] = Math.max(
      minAmount,
      Math.min(maxAmount, Math.round(adjustedAmount * 100) / 100)
    );
    
    // 重新计算总和
    sum = amounts.reduce((a, b) => a + b, 0);
    diff = totalAmount - sum;
    
    // 如果还有偏差，微调最后一个红包
    if (Math.abs(diff) > 0.001) {
      amounts[amounts.length - 1] = Math.max(
        minAmount,
        Math.min(maxAmount, Math.round((amounts[amounts.length - 1] + diff) * 100) / 100)
      );
    }
  }
  
  // 最终验证：确保所有金额都在有效范围内
  for (let i = 0; i < amounts.length; i++) {
    amounts[i] = Math.max(minAmount, Math.min(maxAmount, Math.round(amounts[i] * 100) / 100));
  }
  
  // 最后一次调整总和
  const finalSum = amounts.reduce((a, b) => a + b, 0);
  const finalDiff = totalAmount - finalSum;
  if (Math.abs(finalDiff) > 0.001) {
    const lastIndex = amounts.length - 1;
    amounts[lastIndex] = Math.max(
      minAmount,
      Math.min(maxAmount, Math.round((amounts[lastIndex] + finalDiff) * 100) / 100)
    );
  }

  // 打乱顺序，增加随机性
  for (let i = amounts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [amounts[i], amounts[j]] = [amounts[j], amounts[i]];
  }

  return amounts;
}

/**
 * 从预生成的红包池中获取一个红包
 * MVP模式：使用localStorage存储已分配的红包索引
 */
export function getRedPacketFromPool(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const poolKey = 'redpacket_pool';
  const usedKey = 'redpacket_used';

  // 获取或生成红包池
  let pool: number[] = [];
  const savedPool = localStorage.getItem(poolKey);
  if (savedPool) {
    try {
      pool = JSON.parse(savedPool);
    } catch {
      pool = generateRedPacketPool();
      localStorage.setItem(poolKey, JSON.stringify(pool));
    }
  } else {
    pool = generateRedPacketPool();
    localStorage.setItem(poolKey, JSON.stringify(pool));
  }

  // 获取已使用的索引
  let used: number[] = [];
  const savedUsed = localStorage.getItem(usedKey);
  if (savedUsed) {
    try {
      used = JSON.parse(savedUsed);
    } catch {
      used = [];
    }
  }

  // 如果所有红包都已分配，返回0（应该不会发生，因为只有30个红包）
  if (used.length >= pool.length) {
    return 0;
  }

  // 从未使用的红包中随机选择一个
  const available = pool.filter((_, index) => !used.includes(index));
  if (available.length === 0) {
    return 0;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedAmount = available[randomIndex];
  
  // 找到该金额在原始池中的索引
  const originalIndex = pool.findIndex((amount, index) => 
    amount === selectedAmount && !used.includes(index)
  );

  // 记录已使用
  if (originalIndex !== -1) {
    used.push(originalIndex);
    localStorage.setItem(usedKey, JSON.stringify(used));
  }

  return Math.round(selectedAmount * 100) / 100;
}

/**
 * 检查红包池是否还有剩余
 */
export function hasRedPacketAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const poolKey = 'redpacket_pool';
  const usedKey = 'redpacket_used';

  const savedPool = localStorage.getItem(poolKey);
  const savedUsed = localStorage.getItem(usedKey);

  if (!savedPool) {
    return true; // 如果还没有生成池，认为有可用红包
  }

  let pool: number[] = [];
  let used: number[] = [];

  try {
    pool = JSON.parse(savedPool);
    if (savedUsed) {
      used = JSON.parse(savedUsed);
    }
  } catch {
    return true;
  }

  return used.length < pool.length;
}
