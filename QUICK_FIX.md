# 快速修复指南

## 如果页面不工作，请按以下步骤操作：

### 1. 停止所有开发服务器
```bash
# 停止占用3000端口的进程
lsof -ti:3000 | xargs kill -9
```

### 2. 清理缓存
```bash
rm -rf .next node_modules/.cache
```

### 3. 重新启动
```bash
npm run dev
```

### 4. 访问页面
打开浏览器访问：http://localhost:3000

### 5. 如果仍然不工作

#### 检查浏览器控制台
1. 按 F12 打开开发者工具
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的请求状态

#### 测试路由
- http://localhost:3000/debug - 调试页面（应该能显示）
- http://localhost:3000/test - 测试页面
- http://localhost:3000/ - 首页

#### 常见错误

**错误：Cannot find module**
- 解决：删除 node_modules 和 .next，重新安装
  ```bash
  rm -rf node_modules .next
  npm install
  npm run dev
  ```

**错误：Hydration failed**
- 解决：清除浏览器缓存和localStorage
  ```javascript
  localStorage.clear()
  ```

**错误：404 Not Found**
- 解决：确保 app/page.tsx 文件存在且正确导出

### 6. 验证构建
```bash
npm run build
```
如果构建成功，说明代码没问题，可能是开发服务器的问题。
