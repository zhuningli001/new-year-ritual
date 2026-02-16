# 部署指南

## 🚀 Vercel 部署（推荐）

### 前置要求

1. **GitHub账户** - 用于代码仓库
2. **Vercel账户** - 免费注册 [vercel.com](https://vercel.com)
3. **项目代码** - 已推送到GitHub仓库

### 部署步骤

#### 方法1：通过Vercel Dashboard（推荐）

1. **登录Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账户登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的GitHub仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

4. **环境变量配置**（可选）
   - 如果使用Supabase，添加以下环境变量：
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```
   - 添加站点URL：
     ```
     NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
     ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常2-5分钟）
   - 部署成功后，会获得一个 `*.vercel.app` 域名

#### 方法2：通过Vercel CLI

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd new-year-ritual
   vercel
   ```

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

### 自定义域名（可选）

1. **在Vercel Dashboard中**
   - 进入项目设置 → Domains
   - 添加你的域名（如 `newyear.example.com`）

2. **配置DNS**
   - 添加CNAME记录指向 `cname.vercel-dns.com`
   - 或添加A记录指向Vercel提供的IP地址

3. **SSL证书**
   - Vercel自动提供SSL证书（Let's Encrypt）
   - 无需额外配置

## 📦 其他部署平台

### Netlify

1. **连接GitHub仓库**
   - 登录 [Netlify](https://www.netlify.com)
   - 点击 "New site from Git"
   - 选择GitHub仓库

2. **构建配置**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

3. **环境变量**
   - 在Site settings → Environment variables中添加

### 自托管（Docker）

1. **创建Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **构建和运行**
   ```bash
   docker build -t new-year-ritual .
   docker run -p 3000:3000 new-year-ritual
   ```

## 🔧 部署前检查清单

### 代码检查

- [ ] 代码已推送到Git仓库
- [ ] 所有依赖已添加到 `package.json`
- [ ] `.env.local` 文件已添加到 `.gitignore`
- [ ] 没有硬编码的敏感信息

### 构建检查

- [ ] `npm run build` 成功执行
- [ ] 没有TypeScript错误
- [ ] 没有Lint错误
- [ ] 所有页面可以正常访问

### 功能检查

- [ ] 首页正常显示
- [ ] 抽取功能正常
- [ ] 结果页正常显示
- [ ] 留言墙功能正常
- [ ] 支付二维码显示正常（如果已添加图片）

### 环境变量检查

- [ ] 所有必需的环境变量已配置
- [ ] `NEXT_PUBLIC_SITE_URL` 设置为正确的域名
- [ ] Supabase配置（如果使用）

### 性能检查

- [ ] 图片已优化
- [ ] 代码已压缩
- [ ] 首屏加载时间合理（<3秒）

## 📝 部署后配置

### 1. 更新站点URL

部署后，更新环境变量 `NEXT_PUBLIC_SITE_URL` 为实际域名：
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 2. 添加支付二维码图片

1. 将微信收款二维码上传到 `public/qr-codes/wechat-qr.png`
2. 将支付宝收款二维码上传到 `public/qr-codes/alipay-qr.png`
3. 提交并重新部署

### 3. 配置Supabase（如果使用）

1. 在Supabase Dashboard中配置CORS
2. 添加Vercel域名到允许列表
3. 更新环境变量

### 4. 测试部署

- [ ] 访问部署的网站
- [ ] 测试所有功能
- [ ] 检查移动端显示
- [ ] 测试分享功能

## 🐛 常见问题

### 构建失败

**问题**: `npm run build` 失败

**解决方案**:
1. 检查Node.js版本（需要18+）
2. 清除缓存：`rm -rf .next node_modules`
3. 重新安装依赖：`npm install`
4. 检查TypeScript错误：`npm run lint`

### 环境变量未生效

**问题**: 环境变量在部署后未生效

**解决方案**:
1. 在Vercel Dashboard中重新设置环境变量
2. 确保变量名正确（区分大小写）
3. 重新部署项目

### 图片404错误

**问题**: 图片无法加载

**解决方案**:
1. 确保图片在 `public` 目录下
2. 检查图片路径是否正确
3. 清除浏览器缓存

### 路由404错误

**问题**: 某些路由返回404

**解决方案**:
1. 检查 `next.config.js` 配置
2. 确保所有页面文件存在
3. 检查路由路径是否正确

## 📊 性能优化建议

### 已实现的优化

- ✅ Next.js Image组件优化
- ✅ 代码压缩
- ✅ 静态资源优化
- ✅ 包导入优化（Framer Motion）

### 可选的进一步优化

1. **CDN配置**
   - 使用Vercel的Edge Network（自动）
   - 或配置Cloudflare CDN

2. **图片优化**
   - 使用WebP格式
   - 添加图片懒加载
   - 使用Next.js Image组件

3. **代码分割**
   - 动态导入大型组件
   - 路由级别的代码分割（自动）

4. **缓存策略**
   - 配置静态资源缓存
   - 使用Service Worker（可选）

## 🔒 安全建议

1. **环境变量**
   - 不要提交 `.env.local` 到Git
   - 使用Vercel的环境变量管理

2. **API安全**
   - 验证用户输入
   - 限制API请求频率
   - 使用HTTPS（Vercel自动提供）

3. **内容安全**
   - 验证用户提交的内容
   - 防止XSS攻击
   - 使用CSP头（已配置）

## 📞 支持

如果遇到部署问题：

1. 查看Vercel部署日志
2. 检查构建错误信息
3. 参考 [Next.js部署文档](https://nextjs.org/docs/deployment)
4. 参考 [Vercel文档](https://vercel.com/docs)

## ✨ 总结

部署到Vercel是最简单的方式：

1. ✅ 连接GitHub仓库
2. ✅ 配置环境变量（可选）
3. ✅ 点击部署
4. ✅ 完成！

项目已配置好所有必要的部署设置，可以直接部署使用！
