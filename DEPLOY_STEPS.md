# 部署步骤指南

## 🚀 快速部署到 Vercel（推荐）

### 方法1：通过 GitHub + Vercel（最简单）

#### 步骤1：准备 Git 仓库

1. **初始化 Git（如果还没有）**
   ```bash
   cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"
   git init
   git add .
   git commit -m "Initial commit: New Year Ritual Website"
   ```

2. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建新仓库（例如：`new-year-ritual`）
   - **不要**初始化 README、.gitignore 或 license（我们已经有了）

3. **推送代码到 GitHub**
   ```bash
   git remote add origin https://github.com/zhuningli001/new-year-ritual.git
   git branch -M main
   git push -u origin main
   ```

#### 步骤2：在 Vercel 中部署

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库 `new-year-ritual`
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（如果项目在根目录）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

4. **环境变量**
   - 点击 "Environment Variables"
   - 添加：
     ```
     NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
     ```
   - **注意**：部署后 Vercel 会自动提供域名，可以先部署，然后更新这个变量

5. **部署**
   - 点击 "Deploy"
   - 等待 2-5 分钟
   - 部署完成后会显示部署的 URL

6. **更新环境变量**
   - 部署完成后，复制部署的 URL
   - 在项目设置中更新 `NEXT_PUBLIC_SITE_URL` 为实际部署 URL
   - 重新部署（Vercel 会自动触发）

### 方法2：通过 Vercel CLI（命令行）

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
   cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"
   vercel
   ```

4. **配置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL
   # 输入值：https://your-project.vercel.app
   ```

5. **生产环境部署**
   ```bash
   vercel --prod
   ```

## 📋 部署前检查清单

### ✅ 代码准备
- [ ] 代码已提交到 Git
- [ ] `.gitignore` 已配置（排除 `.env.local`, `.next`, `node_modules`）
- [ ] 所有文件已保存

### ✅ 配置检查
- [ ] `package.json` 中的脚本正确
- [ ] `next.config.js` 配置正确
- [ ] `vercel.json` 配置正确（可选）

### ✅ 环境变量
- [ ] `NEXT_PUBLIC_SITE_URL` 已准备（可以先使用默认值，部署后更新）

### ✅ 资源文件
- [ ] 支付二维码图片已准备（可选，可以后续添加）
  - `public/qr-codes/wechat-qr.png`
  - `public/qr-codes/alipay-qr.png`

## 🔧 部署后配置

### 1. 更新环境变量

部署完成后，在 Vercel 项目设置中：

1. 进入 "Settings" → "Environment Variables"
2. 更新 `NEXT_PUBLIC_SITE_URL` 为实际部署 URL
3. 点击 "Redeploy" 重新部署

### 2. 添加自定义域名（可选）

1. 进入 "Settings" → "Domains"
2. 添加你的域名
3. 按照提示配置 DNS
4. 更新 `NEXT_PUBLIC_SITE_URL` 为新域名

### 3. 验证部署

访问部署的 URL，检查：
- [ ] 首页正常显示
- [ ] 抽取功能正常
- [ ] 结果页正常显示
- [ ] 留言墙正常
- [ ] 支付二维码正常（如果已添加）

## 🐛 常见问题

### 构建失败

**问题**：`npm run build` 失败

**解决方案**：
- Vercel 会自动处理 Next.js 14 和 framer-motion 的兼容性问题
- 如果仍然失败，检查：
  1. Node.js 版本（Vercel 默认使用 18.x）
  2. 依赖包是否正确安装
  3. 查看构建日志中的具体错误

### 环境变量未生效

**问题**：环境变量没有生效

**解决方案**：
1. 确保变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
2. 重新部署项目
3. 清除浏览器缓存

### 图片不显示

**问题**：支付二维码不显示

**解决方案**：
1. 检查图片路径：`public/qr-codes/wechat-qr.png`
2. 确保图片已提交到 Git
3. 检查图片格式和大小
4. 清除浏览器缓存

## 📝 部署完成后的步骤

1. ✅ **测试功能**
   - 访问部署的 URL
   - 测试所有功能
   - 检查移动端显示

2. ✅ **分享链接**
   - 复制部署的 URL
   - 在微信/朋友圈/小红书等平台分享

3. ✅ **监控访问**
   - 在 Vercel 仪表板查看访问统计
   - 监控错误日志

## 🎉 部署成功！

部署完成后，你的网站就可以通过 Vercel 提供的 URL 访问了！

**下一步**：
- 测试所有功能
- 添加支付二维码图片（如果需要）
- 分享链接给用户
