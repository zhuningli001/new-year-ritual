import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 深红色系（主色）- 高雅、沉稳、喜庆
        deepRed: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#B91C1C',   // 深红（高雅，非鲜艳大红）
          600: '#991B1B',   // 更深红
          700: '#7F1D1D',   // 暗红
          800: '#6B1D1D',   // 深暗红
          900: '#4C1D1D',   // 极深红
        },
        // 中国深蓝色系（辅色）- 传统中国蓝，稳重高级
        chineseBlue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1E40AF',   // 中国深蓝（靛蓝）
          600: '#1E3A8A',   // 更深蓝
          700: '#1E3A8A',
          800: '#1E293B',   // 深蓝灰
          900: '#0F172A',   // 接近黑色
        },
        // 青色系（强调色）- 清新、雅致
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',   // 青色（天青）
          600: '#0891B2',   // 深青
          700: '#0E7490',   // 更深青
          800: '#155E75',
          900: '#164E63',
        },
        // 背景色：米白/暖白（高雅背景）
        cream: {
          50: '#FFFEF9',   // 纯米白
          100: '#FDFCF5',
          200: '#FAF9F0',
          300: '#F7F6EB',
          400: '#F4F3E6',
          500: '#F1F0E1',   // 主背景：温暖米白
          600: '#E8E7D8',
        },
        // 金色系（点缀色）- 用于高光、微粒，但要克制使用
        gold: {
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',   // 深金色（克制使用，非鲜艳金）
          600: '#B45309',
          700: '#92400E',
        },
        // 深色文字
        charcoal: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#374151',   // 深灰文字
          600: '#1F2937',   // 更深灰
          700: '#111827',   // 接近黑色
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['serif'],
        mono: ['monospace'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.05em',
      },
      lineHeight: {
        tighter: '1.2',
        tight: '1.4',
        snug: '1.5',
        normal: '1.6',
        relaxed: '1.75',
        loose: '2',
      },
      spacing: {
        // 8px网格系统
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'particle-float': 'particleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
