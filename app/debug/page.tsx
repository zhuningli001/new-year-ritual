export default function DebugPage() {
  return (
    <div className="min-h-screen bg-cream-50 p-8">
      <h1 className="text-4xl text-deepRed-500 mb-4">调试页面</h1>
      <p className="text-charcoal-600 mb-4">如果你能看到这个页面，说明路由正常工作。</p>
      <div className="space-y-2">
        <p><strong>时间:</strong> {new Date().toLocaleString()}</p>
        <p><strong>环境:</strong> {process.env.NODE_ENV || 'development'}</p>
      </div>
      <a href="/" className="text-deepRed-500 underline mt-4 inline-block">返回首页</a>
    </div>
  );
}
