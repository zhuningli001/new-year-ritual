# 部署前检查清单

## ✅ 部署准备检查

### 1. 代码准备
- [ ] 所有代码已保存
- [ ] 代码已测试通过（参考 QUICK_TEST.md）
- [ ] 无未提交的更改

### 2. Git 配置
- [ ] Git 已初始化（`git init`）
- [ ] `.gitignore` 已配置
- [ ] 代码已提交到本地仓库（`git commit`）

### 3. GitHub 准备
- [ ] GitHub 账号已登录
- [ ] 已创建新仓库（或已有仓库）
- [ ] 代码已推送到 GitHub（`git push`）

### 4. Vercel 准备
- [ ] Vercel 账号已注册/登录（https://vercel.com）
- [ ] 已连接 GitHub 账号

### 5. 环境变量准备
- [ ] 知道需要设置的环境变量：`NEXT_PUBLIC_SITE_URL`
- [ ] 可以先使用默认值，部署后更新

### 6. 资源文件（可选）
- [ ] 支付二维码图片已准备（可选）
  - [ ] `public/qr-codes/wechat-qr.png`
  - [ ] `public/qr-codes/alipay-qr.png`

## 🚀 快速部署命令

### 如果还没有初始化 Git：

```bash
cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: New Year Ritual Website"

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 如果已经有 Git 仓库：

```bash
# 检查状态
git status

# 添加更改
git add .

# 提交
git commit -m "Prepare for deployment"

# 推送
git push
```

## 📋 部署步骤摘要

1. **GitHub**
   - 创建仓库
   - 推送代码

2. **Vercel**
   - 访问 https://vercel.com
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置**
   - Framework: Next.js（自动检测）
   - Root Directory: `./`
   - 环境变量：添加 `NEXT_PUBLIC_SITE_URL`（可以先留空）

4. **部署**
   - 点击 "Deploy"
   - 等待 2-5 分钟

5. **完成**
   - 复制部署的 URL
   - 更新环境变量 `NEXT_PUBLIC_SITE_URL`
   - 重新部署

## ✅ 部署后检查

- [ ] 网站可以访问
- [ ] 首页正常显示
- [ ] 抽取功能正常
- [ ] 结果页正常显示
- [ ] 留言墙正常
- [ ] 移动端显示正常

## 🎉 完成！

部署完成后，你就可以分享链接了！

**详细步骤请查看：DEPLOY_STEPS.md**
