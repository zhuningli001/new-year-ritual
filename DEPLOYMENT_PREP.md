# 部署准备清单

## 📋 部署前检查

### 1. 代码检查 ✅
- [x] ESLint 检查通过
- [x] TypeScript 类型检查通过
- [x] 无运行时错误
- [x] 所有功能测试通过

### 2. 环境变量配置

#### 必需的环境变量（Vercel）
在 Vercel 项目设置中添加：

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### 可选的环境变量（如果使用 Supabase）
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**注意**：MVP 模式不需要 Supabase，可以留空。

### 3. 支付二维码图片

#### 准备图片
1. 获取微信收款二维码（保存为 PNG 格式）
2. 获取支付宝收款二维码（保存为 PNG 格式）

#### 放置位置
将图片放到以下位置：
```
public/qr-codes/wechat-qr.png
public/qr-codes/alipay-qr.png
```

#### 图片要求
- 格式：PNG（推荐）或 JPG
- 尺寸：建议 512x512 像素或更大
- 文件大小：建议小于 500KB
- 清晰度：确保二维码清晰可扫描

### 4. 部署到 Vercel

#### 方法1：通过 GitHub（推荐）

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置项目：
     - Framework Preset: Next.js
     - Root Directory: `./new-year-ritual`（如果项目在子目录）
     - Build Command: `npm run build`（默认）
     - Output Directory: `.next`（默认）
     - Install Command: `npm install`（默认）

3. **配置环境变量**
   - 在项目设置中添加 `NEXT_PUBLIC_SITE_URL`
   - 如果使用 Supabase，添加相关变量

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 2-5 分钟）

#### 方法2：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd new-year-ritual
   vercel
   ```

4. **配置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL
   ```

### 5. 部署后检查

#### 功能检查
- [ ] 访问部署的 URL
- [ ] 首页正常显示
- [ ] 抽取功能正常
- [ ] 结果页正常显示
- [ ] 留言墙正常
- [ ] 支付二维码正常显示（如果已添加）

#### 性能检查
- [ ] 页面加载速度快
- [ ] 图片加载正常
- [ ] 动画流畅

#### SEO 检查
- [ ] 页面标题正确
- [ ] Meta 描述正确
- [ ] Open Graph 图片正常（如果已添加）

### 6. 域名配置（可选）

如果需要自定义域名：

1. **在 Vercel 中添加域名**
   - 项目设置 → Domains
   - 添加你的域名
   - 按照提示配置 DNS

2. **更新环境变量**
   - 更新 `NEXT_PUBLIC_SITE_URL` 为新域名

3. **重新部署**
   - Vercel 会自动重新部署

## 📝 部署清单

### 部署前
- [ ] 代码已提交到 Git
- [ ] 所有测试通过
- [ ] 支付二维码图片已准备（可选）
- [ ] 环境变量已配置

### 部署中
- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已添加
- [ ] 部署已启动

### 部署后
- [ ] 网站可以访问
- [ ] 所有功能正常
- [ ] 性能良好
- [ ] 无错误日志

## 🎯 部署完成

部署完成后，你可以：
1. 分享链接给用户
2. 在微信/朋友圈/小红书等平台分享
3. 监控访问量和用户反馈

## 💡 提示

- **MVP 模式**：不需要 Supabase，可以直接部署
- **构建问题**：如果遇到构建错误，Vercel 会自动处理
- **环境变量**：确保 `NEXT_PUBLIC_SITE_URL` 正确设置
- **支付二维码**：可以先部署，后续再添加图片

## 🚀 开始部署

准备好后，按照上面的步骤开始部署吧！
