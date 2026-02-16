# 故障排查指南

## 页面不工作 - 检查清单

### 1. 检查开发服务器是否运行
```bash
# 检查端口3000是否被占用
lsof -ti:3000

# 如果被占用，停止进程
kill <PID>

# 重新启动开发服务器
npm run dev
```

### 2. 检查浏览器控制台错误
打开浏览器开发者工具（F12），查看Console标签是否有错误信息。

### 3. 检查网络请求
在Network标签中查看：
- 页面请求是否返回200状态码
- API请求（/api/draw, /api/messages）是否正常

### 4. 清除浏览器缓存
- 清除localStorage：`localStorage.clear()`
- 硬刷新页面：Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)

### 5. 检查文件是否正确
确保以下文件存在：
- `app/page.tsx` - 首页组件
- `app/layout.tsx` - 根布局
- `app/globals.css` - 全局样式
- `lib/constants/content.ts` - 内容配置

### 6. 重新构建项目
```bash
# 清理缓存
rm -rf .next node_modules/.cache

# 重新构建
npm run build

# 启动开发服务器
npm run dev
```

### 7. 测试路由
访问以下URL测试：
- http://localhost:3000/ - 首页
- http://localhost:3000/debug - 调试页面
- http://localhost:3000/test - 测试页面
- http://localhost:3000/result?type=blessing&blessingId=test - 结果页

### 8. 常见问题

#### 问题：页面显示404
- **原因**: 路由配置问题或开发服务器未正常启动
- **解决**: 检查 `app/page.tsx` 是否存在，重启开发服务器

#### 问题：页面空白
- **原因**: JavaScript错误或组件渲染失败
- **解决**: 检查浏览器控制台错误，查看是否有组件导入错误

#### 问题：样式不显示
- **原因**: TailwindCSS未正确加载
- **解决**: 检查 `app/globals.css` 和 `tailwind.config.ts`

#### 问题：API请求失败
- **原因**: API路由未正确配置
- **解决**: 检查 `app/api/draw/route.ts` 和 `app/api/messages/route.ts`

## 调试步骤

1. **访问调试页面**: http://localhost:3000/debug
   - 如果能看到调试页面，说明路由正常
   - 如果看不到，说明开发服务器有问题

2. **检查首页**: http://localhost:3000/
   - 应该看到开场动画（3秒）
   - 然后显示主页面内容

3. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看Console标签的错误信息
   - 查看Network标签的请求状态

4. **检查终端输出**
   - 查看开发服务器的输出日志
   - 查找错误或警告信息
