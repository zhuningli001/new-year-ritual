# 修复路由跳转问题

## ❌ 问题描述

网站不稳定，总是在跳，跳到404页面。

## 🔍 原因分析

1. **重复跳转问题**：
   - `app/page.tsx` 中的 `useEffect` 会在 `showAnimation` 变为 false 时检查是否已抽取过，如果已抽取过就自动跳转
   - `app/result/page.tsx` 中的 `useEffect` 会在没有找到结果时跳转到首页
   - 这些 `useEffect` 可能在页面加载时多次触发，导致反复跳转

2. **历史记录堆积**：
   - 使用 `router.push()` 会在浏览器历史记录中添加新条目
   - 多次跳转会导致历史记录堆积，用户点击返回按钮时会反复跳转

3. **竞态条件**：
   - `useEffect` 依赖项变化时可能触发多次执行
   - 没有防止重复执行的机制

## ✅ 解决方案

### 1. 使用 `useRef` 防止重复跳转

在 `app/page.tsx` 和 `app/result/page.tsx` 中添加 `hasRedirected` ref：

```typescript
const hasRedirected = useRef(false); // 防止重复跳转

useEffect(() => {
  // 如果已经跳转过，不再执行
  if (hasRedirected.current) {
    return;
  }
  // ... 跳转逻辑
  if (!hasRedirected.current) {
    hasRedirected.current = true;
    router.replace('/'); // 标记已跳转
  }
}, [dependencies]);
```

### 2. 使用 `router.replace()` 而不是 `router.push()`

- `router.push()`: 添加新的历史记录条目
- `router.replace()`: 替换当前历史记录条目，不会堆积历史记录

**修改位置**：
- `app/page.tsx`: 所有 `router.push()` 改为 `router.replace()`
- `app/result/page.tsx`: 跳转首页时使用 `router.replace()`

### 3. 优化 useEffect 依赖项

确保 `useEffect` 只在必要时执行，避免不必要的重复执行。

## 📝 已修复的文件

1. ✅ `app/page.tsx`
   - 添加 `hasRedirected` ref
   - 所有 `router.push()` 改为 `router.replace()`
   - 防止重复跳转

2. ✅ `app/result/page.tsx`
   - 添加 `hasRedirected` ref
   - 跳转首页时使用 `router.replace()`
   - 防止重复跳转

## 🎯 修复效果

- ✅ 不再出现反复跳转的问题
- ✅ 浏览器历史记录不会堆积
- ✅ 页面加载更稳定
- ✅ 用户体验更好

## 💡 最佳实践

1. **使用 `router.replace()` 进行程序化跳转**：
   - 当跳转是用户操作的结果时（如点击按钮），使用 `router.push()`
   - 当跳转是程序逻辑的结果时（如自动重定向），使用 `router.replace()`

2. **防止重复执行**：
   - 使用 `useRef` 跟踪是否已执行过某些操作
   - 在 `useEffect` 中检查 ref 值，避免重复执行

3. **优化依赖项**：
   - 确保 `useEffect` 的依赖项准确
   - 避免不必要的依赖项导致重复执行

## ✨ 修复完成

路由跳转问题已修复！现在网站应该稳定运行，不会再出现反复跳转的问题。
