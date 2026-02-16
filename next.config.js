/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 性能优化
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // 实验性功能
  // 注意：framer-motion的优化可能导致构建错误，暂时禁用
  // experimental: {
  //   optimizePackageImports: ['framer-motion'],
  // },
  // 输出配置（注释掉standalone，避免构建错误）
  // output: 'standalone',
  // 重定向配置（如果需要）
  async redirects() {
    return [];
  },
  // Headers配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
