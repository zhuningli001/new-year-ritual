-- 创建红包池表
CREATE TABLE IF NOT EXISTS redpacket_pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 88.00,
  remaining_amount DECIMAL(10, 2) NOT NULL DEFAULT 88.00,
  total_winners INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建红包获得者表
CREATE TABLE IF NOT EXISTS redpacket_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES redpacket_pool(id),
  user_identifier TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pool_id, user_identifier)
);

-- 创建祝福库表
CREATE TABLE IF NOT EXISTS blessings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('text', 'image')),
  content TEXT,
  image_url TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户抽取记录表
CREATE TABLE IF NOT EXISTS user_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_identifier TEXT NOT NULL,
  result_type TEXT NOT NULL CHECK (result_type IN ('redpacket', 'blessing')),
  blessing_id UUID REFERENCES blessings(id),
  redpacket_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建留言墙表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  is_host BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_host ON messages(is_host DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_draws_identifier ON user_draws(user_identifier);

-- 启用Row Level Security
ALTER TABLE redpacket_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE redpacket_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_draws ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Anyone can read pool" ON redpacket_pool FOR SELECT USING (true);
CREATE POLICY "Anyone can read blessings" ON blessings FOR SELECT USING (true);
CREATE POLICY "Anyone can read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- 红包写入需要通过API控制（使用service role）
-- redpacket_winners和user_draws的插入由API控制

-- 插入初始红包池
INSERT INTO redpacket_pool (total_amount, remaining_amount, is_active)
VALUES (88.00, 88.00, true)
ON CONFLICT DO NOTHING;

-- 插入默认祝福（如果没有祝福库）
INSERT INTO blessings (type, content, rarity)
VALUES 
  ('text', '新年快乐！愿你在2026年马年，马上有福，马到成功！', 'common'),
  ('text', '马到成功，前程似锦！', 'common'),
  ('text', '马上有福，万事如意！', 'common'),
  ('text', '龙马精神，身体健康！', 'common'),
  ('text', '一马当先，事业有成！', 'common')
ON CONFLICT DO NOTHING;
