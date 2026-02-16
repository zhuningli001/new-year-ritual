# 使用备用端口启动

## 问题
端口3000被占用，无法启动开发服务器

## 解决方案
使用端口3001启动开发服务器

## 访问地址
- **新地址**：http://localhost:3001

## 手动启动（使用3001端口）

```bash
cd "/Users/zhuningli/Cursor/2026-New Year/new-year-ritual"
PORT=3001 npm run dev
```

## 或者修改 package.json

如果你想永久使用3001端口，可以修改 `package.json`：

```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

然后运行：
```bash
npm run dev
```

## 停止占用3000端口的进程

如果你想继续使用3000端口，需要手动停止占用进程：

1. 打开终端
2. 运行：
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
3. 然后启动：
   ```bash
   npm run dev
   ```
