# 启动开发服务器指南

## 如果 http://localhost:3000 无法打开

### 1. 检查端口占用
```bash
lsof -ti:3000
```
如果有输出，说明端口被占用，需要停止该进程。

### 2. 停止占用端口的进程
```bash
lsof -ti:3000 | xargs kill -9
```

### 3. 清理缓存
```bash
rm -rf .next node_modules/.cache
```

### 4. 重新启动开发服务器
```bash
npm run dev
```

### 5. 等待服务器启动
开发服务器需要10-20秒才能完全启动。请等待看到以下信息：
```
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000
  ✓ Ready in Xs
```

### 6. 访问页面
- 主页：http://localhost:3000
- 调试页：http://localhost:3000/debug
- 测试页：http://localhost:3000/test

## 常见问题

### 问题：端口被占用
**解决**：停止占用3000端口的进程
```bash
lsof -ti:3000 | xargs kill -9
```

### 问题：服务器启动失败
**解决**：检查Node.js版本（需要18+）
```bash
node --version
```

### 问题：模块找不到
**解决**：重新安装依赖
```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题：构建错误
**解决**：清理缓存并重新构建
```bash
rm -rf .next
npm run build
```

## 手动启动步骤

1. 打开终端
2. 进入项目目录：
   ```bash
   cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"
   ```
3. 停止现有进程（如果有）：
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```
5. 等待10-20秒
6. 访问 http://localhost:3000
