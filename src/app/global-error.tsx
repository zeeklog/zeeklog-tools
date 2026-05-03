'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    console.error('[Global layout error]', error?.digest, error)
  }, [error])

  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center antialiased">
        <h1 className="text-xl font-semibold text-gray-900">页面暂时无法打开</h1>
        <p className="text-sm text-gray-600 max-w-md">
          工具站遇到了一点异常，请稍后再试。
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          重试
        </button>
      </body>
    </html>
  )
}
