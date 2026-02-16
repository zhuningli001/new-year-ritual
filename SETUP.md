# 设置指南

## 🚀 MVP模式（快速开始）

**无需任何配置即可运行！**

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` - 所有功能使用模拟数据运行。

---

## 📦 完整模式（需要Supabase）

如需使用真实数据库和持久化存储，请按以下步骤配置：

## 1. 环境变量配置

复制 `.env.local.example` 为 `.env.local` 并填入你的Supabase配置：

```bash
cp .env.local.example .env.local
```

## 2. Supabase设置

### 2.1 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取项目URL和API密钥

### 2.2 执行数据库迁移

在Supabase Dashboard的SQL Editor中执行 `supabase/migrations/001_initial_schema.sql`

或者使用Supabase CLI：

```bash
supabase db push
```

### 2.3 配置Storage

1. 在Supabase Dashboard中创建Storage bucket：`blessing-images`
2. 设置为公开访问（Public）

### 2.4 插入发起人留言

在Supabase SQL Editor中执行：

```sql
INSERT INTO messages (nickname, content, is_host)
VALUES ('宁莉', '感谢大家的参与！愿这份祝福伴随你度过美好的2026年。', true);
```

## 3. 运行项目

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`

## 4. 下一步开发

- [ ] 添加微粒动画系统（Particles.tsx）
- [ ] 添加抽象化马形Logo组件
- [ ] 完善留言墙功能
- [ ] 添加社交分享功能
- [ ] 添加支付二维码展示
