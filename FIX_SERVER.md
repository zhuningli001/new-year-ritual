# 修复开发服务器无法访问

## 问题
http://localhost:3000 无法打开

## 原因
端口3000被多个进程占用

## 解决方案

### 已执行的操作
1. ✅ 停止所有占用3000端口的进程
2. ✅ 清理构建缓存（.next目录）
3. ✅ 重新启动开发服务器

### 手动操作步骤

如果自动修复不成功，请手动执行：

```bash
# 1. 进入项目目录
cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"

# 2. 停止所有占用3000端口的进程
lsof -ti:3000 | xargs kill -9

# 3. 清理缓存
rm -rf .next

# 4. 启动开发服务器
npm run dev
```

### 等待服务器启动
开发服务器需要10-20秒才能完全启动。请等待看到：
```
✓ Ready in Xs
- Local:        http://localhost:3000
```

### 验证服务器运行
1. 检查端口是否被占用：
   ```bash
   lsof -ti:3000
   ```
   如果有输出，说明服务器正在运行

2. 访问页面：
   - http://localhost:3000
   - http://localhost:3000/debug
   - http://localhost:3000/test

### 如果仍然无法访问

1. **检查防火墙**：确保本地防火墙没有阻止3000端口

2. **尝试其他端口**：
   ```bash
   PORT=3001 npm run dev
   ```
   然后访问 http://localhost:3001

3. **检查Node.js版本**：
   ```bash
   node --version
   ```
   需要 Node.js 18+ 版本

4. **查看终端输出**：
   查看开发服务器的输出日志，查找错误信息
