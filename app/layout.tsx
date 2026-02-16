import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "宁莉祝你「马上有福」「马到成功」，来抢红包 | Ning Li Wishes You Fortune",
    template: "%s | 新年数字仪式",
  },
  description: "宁莉祝你「马上有福」「马到成功」，来抢红包。参与新年数字仪式，抽取祝福或红包，留下新年留言。宁莉的真诚祝福，温暖有温度。",
  keywords: ["新年祝福", "红包", "马年", "2026", "新年", "祝福", "宁莉", "新年数字仪式"],
  authors: [{ name: "宁莉" }],
  creator: "宁莉",
  publisher: "宁莉",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "宁莉祝你「马上有福」「马到成功」，来抢红包",
    description: "参与新年数字仪式，抽取祝福或红包，留下新年留言。宁莉的真诚祝福，温暖有温度。",
    url: siteUrl,
    siteName: "新年数字仪式",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "新年数字仪式",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "宁莉祝你「马上有福」「马到成功」，来抢红包",
    description: "参与新年数字仪式，抽取祝福或红包，留下新年留言。",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 如果需要Google Search Console验证，可以添加
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
