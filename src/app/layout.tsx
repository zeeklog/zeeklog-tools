import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import './globals.css'
import { SITE_DOMAIN, SITE_NAME_ZH } from '@/config/site-brand'
import { siteOrigin } from '@/lib/site-url'

const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: SITE_NAME_ZH,
    template: `%s | ${SITE_NAME_ZH}`,
  },
  description: `${SITE_DOMAIN} 在线工具箱，收录常用格式转换、编码解码、文本处理、网络排障与图片辅助工具。`,
  keywords: ['在线工具箱', '开发者工具', 'JSON 格式化', '编码解码', '网络工具', SITE_DOMAIN, SITE_NAME_ZH],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '192x192' }],
  },
  appleWebApp: {
    title: SITE_NAME_ZH,
    capable: true,
    statusBarStyle: 'default',
  },
  openGraph: {
    title: SITE_NAME_ZH,
    description: `${SITE_DOMAIN} 在线工具箱，汇总常用格式转换、编码解码、文本处理、网络排障与图片辅助工具。`,
    type: 'website',
    siteName: SITE_NAME_ZH,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          跳到主要内容
        </a>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-orange-100/80 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
                  {SITE_NAME_ZH}
                </Link>
                <p className="mt-1 text-sm text-slate-600">格式转换、编码解码、文本处理与开发辅助工具。</p>
              </div>
              <nav aria-label="主导航">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-900"
                >
                  首页
                </Link>
              </nav>
            </div>
          </header>

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-slate-200/80 bg-white/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <p>{SITE_NAME_ZH}</p>
              <p>常用开发与内容处理工具集合。</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
