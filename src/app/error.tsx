'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    console.error('[App segment error]', error?.digest ?? 'unknown')
  }, [error])

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-gray-900">页面暂时无法打开</h1>
      <p className="text-sm text-gray-600 max-w-md">
        工具站遇到了一点异常，请稍后再试。
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
        重试
      </button>
    </div>
  )
}
