import { CONTENT } from '@/lib/constants/content';
import type { DrawResult } from '@/lib/types';

/**
 * 抽取祝福逻辑
 * 根据概率决定是红包还是祝福卡
 */
export function determineDrawResult(): 'redpacket' | 'blessing' {
  const random = Math.random();
  return random < CONTENT.drawProbability.redpacket ? 'redpacket' : 'blessing';
}
