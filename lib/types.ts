export type DrawResult = {
  type: 'redpacket' | 'blessing';
  amount?: number;
  blessing?: {
    id: string;
    type: 'text' | 'image';
    content?: string;
    imageUrl?: string;
  };
};

export type PaymentStatus = 'pending' | 'paid' | 'confirmed';

export type PaymentRecord = {
  id: string;
  amount: number;
  method: 'wechat' | 'alipay';
  status: PaymentStatus;
  paidAt?: string;
  confirmedAt?: string;
  note?: string;
};

export type Message = {
  id: string;
  nickname: string;
  content: string;
  isHost?: boolean;
  createdAt: string;
};

export type RedPacketPool = {
  id: string;
  totalAmount: number;
  remainingAmount: number;
  totalWinners: number;
  isActive: boolean;
};

export type Blessing = {
  id: string;
  type: 'text' | 'image';
  content?: string;
  imageUrl?: string;
  rarity: 'common' | 'rare' | 'epic';
};
