# 新年数字仪式 - New Year Interactive Ritual

一个优雅的新年祝福网站，支持抽取红包和祝福，带有留言墙功能。

## ✨ 功能特性

- 🎬 **开场动画** - 3秒优雅的开场动画
- 🎁 **随机抽取** - 15%概率获得红包，85%概率获得祝福
- 💰 **支付系统** - 支持微信/支付宝二维码支付
- 💬 **留言墙** - 用户可以留下新年祝福
- 📱 **响应式设计** - 完美适配手机、平板、桌面
- 🎨 **优雅设计** - 东方极简风格，高质感UI

## 🚀 快速开始

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：http://localhost:3000（或 3001，如果 3000 被占用）

### 构建生产版本

```bash
npm run build
npm start
```

## 📋 环境变量

创建 `.env.local` 文件（参考 `.env.example`）：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**部署到 Vercel 后**，在项目设置中添加环境变量：
- `NEXT_PUBLIC_SITE_URL` = 你的部署 URL

## 🎨 支付二维码

将支付二维码图片放在 `public/qr-codes/` 目录：

- `wechat-qr.png` - 微信收款二维码
- `alipay-qr.png` - 支付宝收款二维码

详细说明请查看 `public/qr-codes/README.md`

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **语言**: TypeScript
- **部署**: Vercel

## 🚀 部署

### 部署到 Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成！

详细步骤请查看 `DEPLOY_STEPS.md`

## 📝 项目结构

```
new-year-ritual/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── result/            # 结果页
│   ├── wall/              # 留言墙
│   └── api/               # API 路由
├── components/             # React 组件
├── lib/                   # 工具函数和类型定义
├── public/                # 静态资源
│   └── qr-codes/          # 支付二维码
└── styles/               # 全局样式
```

## 🧪 测试

查看 `QUICK_TEST.md` 进行快速测试，或 `TEST_CHECKLIST.md` 进行完整测试。

## 📄 许可证

MIT

## 👤 作者

宁莉

---

**新年快乐！愿你在2026年马年，马上有福，马到成功！** 🐎
