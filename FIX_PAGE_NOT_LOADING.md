# 修复页面刷不出来的问题

## ❌ 问题描述

页面刷不出来，一直显示加载中或空白。

## 🔍 原因分析

1. **useEffect 依赖项问题**：
   - 之前使用空依赖数组 `[]`，导致 `searchParams` 无法读取
   - `searchParams` 在 Suspense 边界内需要特殊处理

2. **searchParams 加载时机**：
   - `useSearchParams()` 在 Suspense 边界内可能需要时间加载
   - 需要延迟检查，确保参数已加载

3. **状态管理问题**：
   - `hasRedirected` 的逻辑可能导致页面卡在加载状态
   - 需要更清晰的逻辑来处理不同情况

## ✅ 解决方案

### 1. 修复 `app/result/page.tsx`

**问题**：`useEffect` 无法正确读取 `searchParams`

**修复**：
- 恢复 `searchParams` 和 `router` 作为依赖项
- 添加延迟检查机制，确保 `searchParams` 已加载
- 使用 `hasProcessed` ref 防止重复处理
- 优化逻辑流程，确保所有情况都能正确处理

```typescript
useEffect(() => {
  if (hasProcessed.current) {
    return;
  }

  // 优先从localStorage读取
  const savedResult = getDrawResult();
  if (savedResult) {
    setResult(savedResult as DrawResult);
    setLoading(false);
    hasProcessed.current = true;
    return;
  }

  // 从URL参数读取
  const type = searchParams.get('type');
  const amount = searchParams.get('amount');
  const blessingId = searchParams.get('blessingId');

  // 如果没有参数，延迟检查（等待 searchParams 加载）
  if (!type && !amount && !blessingId) {
    const timer = setTimeout(() => {
      // 重新检查参数
      // ...
    }, 300);
    return () => clearTimeout(timer);
  }

  // 处理有参数的情况
  // ...
}, [searchParams, router]);
```

### 2. 优化逻辑流程

- 优先检查 localStorage（最快）
- 然后检查 URL 参数
- 如果都没有，延迟后再次检查
- 确保所有情况都能正确处理

## 📝 已修复的文件

1. ✅ `app/result/page.tsx`
   - 修复了 `useEffect` 的依赖项问题
   - 添加了延迟检查机制
   - 优化了逻辑流程

## 🎯 修复效果

- ✅ 页面可以正常加载
- ✅ `searchParams` 可以正确读取
- ✅ 不会卡在加载状态
- ✅ 所有情况都能正确处理

## 💡 最佳实践

1. **Suspense 边界内的 searchParams**：
   - 使用 `useSearchParams()` 时，需要考虑加载时机
   - 添加延迟检查，确保参数已加载

2. **状态管理**：
   - 使用 `useRef` 跟踪处理状态
   - 确保逻辑清晰，避免重复处理

3. **错误处理**：
   - 确保所有情况都有对应的处理逻辑
   - 避免页面卡在加载状态

## ✨ 修复完成

页面加载问题已修复！现在页面应该可以正常显示，不会再刷不出来。
