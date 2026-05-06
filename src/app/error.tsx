'use client'

import { useEffect } from 'react'
import { t, type Locale } from '@/lib/i18n'

function getClientLocale(): Locale {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'
}

/**
 * 段级错误边界：不向用户展示 Prisma/堆栈等内部信息，仅记录到控制台。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const i18n = t(getClientLocale())
  useEffect(() => {
    console.error('[App segment error]', error?.digest ?? 'unknown')
  }, [error])

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-gray-900">{i18n.pageErrorTitle}</h1>
      <p className="text-sm text-gray-600 max-w-md">
        {i18n.pageErrorBody}
      </p>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.reload()
            return
          }
          reset()
        }}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
      >
        {i18n.retry}
      </button>
    </div>
  )
}
