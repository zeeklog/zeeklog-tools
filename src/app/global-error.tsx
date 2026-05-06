'use client'

import { useEffect } from 'react'
import { t, type Locale } from '@/lib/i18n'

function getClientLocale(): Locale {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'
}

/**
 * 根布局级错误（含 layout 内抛错）：必须自带 html/body。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = getClientLocale()
  const i18n = t(locale)
  useEffect(() => {
    console.error('[Global layout error]', error?.digest, error)
  }, [error])

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center antialiased">
        <h1 className="text-xl font-semibold text-gray-900">{i18n.pageErrorTitle}</h1>
        <p className="text-sm text-gray-600 max-w-md">
          {i18n.pageErrorBody}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          {i18n.retry}
        </button>
      </body>
    </html>
  )
}
