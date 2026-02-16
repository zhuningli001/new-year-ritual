# 修复运行时错误

## ❌ 错误信息

```
Error: Could not find the module ".../framer-motion/dist/es/index.mjs#motion#div" in the React Client Manifest.
```

## 🔍 原因

`not-found.tsx` 和 `loading.tsx` 使用了 `framer-motion` 的 `motion` 组件，但没有添加 `'use client'` 指令。

在 Next.js App Router 中：
- 默认情况下，所有组件都是**服务器组件**
- `framer-motion` 只能在**客户端组件**中使用
- 服务器组件不能使用客户端库（如 framer-motion）

## ✅ 解决方案

### 已修复
1. ✅ 在 `app/not-found.tsx` 添加 `'use client'`
2. ✅ 在 `app/loading.tsx` 添加 `'use client'`

### 修复内容

**app/not-found.tsx**
```typescript
'use client';  // ← 添加这行

import Link from 'next/link';
import { motion } from 'framer-motion';
// ...
```

**app/loading.tsx**
```typescript
'use client';  // ← 添加这行

import { motion } from 'framer-motion';
// ...
```

## 📝 验证

修复后：
1. ✅ 清除缓存：`rm -rf .next`
2. ✅ 重启开发服务器：`npm run dev`
3. ✅ 访问页面应该不再报错：`http://localhost:3001`（如果 3000 被占用，Next.js 会自动使用 3001）

## 💡 规则总结

### Next.js App Router 规则

1. **服务器组件**（默认）
   - 不能使用客户端库（如 framer-motion）
   - 不能使用浏览器API（如 localStorage, window）
   - 不能使用 React Hooks（useState, useEffect等）

2. **客户端组件**（需要 `'use client'`）
   - 可以使用客户端库
   - 可以使用浏览器API
   - 可以使用 React Hooks
   - 可以使用事件处理（onClick等）

### 何时使用 `'use client'`

- ✅ 使用 `framer-motion`
- ✅ 使用 `useState`, `useEffect` 等 Hooks
- ✅ 使用浏览器API（localStorage, window等）
- ✅ 需要事件处理（onClick, onChange等）
- ✅ 使用第三方客户端库

## 🎯 当前状态

所有使用 `framer-motion` 的文件都已正确标记为客户端组件：
- ✅ `app/page.tsx` - 'use client'
- ✅ `app/result/page.tsx` - 'use client'
- ✅ `app/wall/page.tsx` - 'use client'
- ✅ `app/error.tsx` - 'use client'
- ✅ `app/global-error.tsx` - 'use client'
- ✅ `app/not-found.tsx` - 'use client' ⭐ 已修复
- ✅ `app/loading.tsx` - 'use client' ⭐ 已修复

## ✨ 修复完成

错误已修复！现在所有页面都应该能正常工作了。
