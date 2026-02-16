export const CONTENT = {
  // 发起人信息
  host: {
    name: "宁莉",
    nameEn: "Ning Li",
    greeting: {
      zh: "新年快乐！愿你在2026年马年，马上有福，马到成功！",
      en: "Happy New Year! May the Year of the Horse bring you fortune and instant success!",
    },
    signature: "宁莉", // 用于页面底部签名
    message: {
      zh: "感谢大家的参与！愿这份祝福伴随你度过美好的2026年。",
      en: "Thank you for participating! May this blessing accompany you through a wonderful 2026.",
    },
  },
  title: {
    zh: {
      main: "「马上有福」「马到成功」",
      sub: "来抢红包",
      full: "宁莉祝你「马上有福」「马到成功」，来抢红包",
    },
    en: {
      main: "Horse Brings Fortune & Instant Success",
      sub: "Grab Your Red Packet",
      full: 'Ning Li Wishes You "Horse Brings Fortune" & "Instant Success" - Grab Your Red Packet',
    },
  },
  // 分享文案
  share: {
    zh: "宁莉祝你「马上有福」「马到成功」！来抽取新年祝福，还有机会抢红包～",
    en: "Ning Li wishes you fortune and success! Draw your New Year blessing and grab a red packet!",
  },
  // 抽取概率配置
  drawProbability: {
    redpacket: 0.15,  // 15%概率抢到红包
    blessing: 0.85,   // 85%概率得到祝福卡
  },
  // 红包池配置
  redpacketPool: {
    totalAmount: 88.00,    // 总额88元
    totalCount: 30,        // 分成30份
    maxAmount: 3.88,       // 最高额度3.88元
    minAmount: 0.18,       // 最低额度0.18元
  },
  // MVP祝福语库（固定祝福语，无需数据库）
  blessings: [
    '新年快乐！愿你在2026年马年，马上有福，马到成功！',
    '愿你在新的一年里，如骏马奔腾，前程似锦！',
    '马年大吉！愿你事业如马，一马当先，马到成功！',
    '新年新气象！愿你在马年里，马上有钱，马上有福！',
    '祝你马年快乐！愿好运如马，常伴你左右！',
    '愿你在2026年，如马般矫健，如马般勇敢，如马般成功！',
    '马年祝福：愿你心想事成，马到成功，马上有福！',
    '新年快乐！愿你在马年里，马不停蹄，奔向成功！',
  ],
} as const;
