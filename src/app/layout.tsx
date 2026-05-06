import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import './globals.css'
import { SITE_DOMAIN } from '@/config/site-brand'
import { t } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { siteOrigin } from '@/lib/site-url'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'

const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  display: 'swap',
  weight: '100 900',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const i18n = t(locale)

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: i18n.siteName,
      template: `%s | ${i18n.siteName}`,
    },
    description: `${SITE_DOMAIN} ${i18n.layoutMetaDescription}`,
    keywords: locale === 'zh'
      ? ['在线工具箱', '开发者工具', 'JSON 格式化', '编码解码', '网络工具', SITE_DOMAIN, i18n.siteName]
      : ['online toolkit', 'developer tools', 'JSON formatter', 'encoding', 'network tools', SITE_DOMAIN, i18n.siteName],
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
      title: i18n.siteName,
      capable: true,
      statusBarStyle: 'default',
    },
    openGraph: {
      title: i18n.siteName,
      description: `${SITE_DOMAIN} ${i18n.layoutOgDescription}`,
      type: 'website',
      siteName: i18n.siteName,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f97316',
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
      <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.45-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.84.72 1.23 1.87.88 2.33.67.07-.54.28-.88.51-1.08-1.78-.21-3.64-.92-3.64-4.08 0-.9.31-1.63.82-2.2-.08-.21-.36-1.05.08-2.19 0 0 .67-.22 2.2.84a7.35 7.35 0 0 1 4 0c1.53-1.06 2.2-.84 2.2-.84.44 1.14.16 1.98.08 2.19.51.57.82 1.29.82 2.2 0 3.17-1.87 3.87-3.65 4.08.29.25.54.73.54 1.47 0 1.06-.01 1.92-.01 2.18 0 .22.14.48.55.4A8.21 8.21 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 stroke-current" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.4 14.4 0 0 1 0 18M12 3a14.4 14.4 0 0 0 0 18" />
    </svg>
  )
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getRequestLocale()
  const i18n = t(locale)

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          {i18n.skipToContent}
        </a>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-orange-100/80 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
                    {i18n.siteName}
                  </Link>
                  <a
                    href="https://github.com/zeeklog/zeeklog-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={i18n.githubOpenSourceAria}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <GitHubIcon />
                    <span>{i18n.githubOpenSourceBadge}</span>
                  </a>
                  <a
                    href="https://zeeklog.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={i18n.authorHomepageAria}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <GlobeIcon />
                    <span>{i18n.authorHomepageBadge}</span>
                  </a>
                </div>
                <p className="mt-1 text-sm text-slate-600">{i18n.siteTagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <nav aria-label={i18n.mainNavLabel}>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-900"
                  >
                    {i18n.home}
                  </Link>
                </nav>
                <LanguageSwitcher locale={locale} />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-slate-200/80 bg-white/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <p>{i18n.siteName}</p>
              <p>{i18n.footerSummary}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
