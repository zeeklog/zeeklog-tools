'use client'

import type { ReactNode } from 'react'
import { UiErrorBoundary } from '@/components/common/UiErrorBoundary'

type ToolErrorBoundaryProps = {
  /** 用于无障碍与日志 */
  toolTitle: string
  children: ReactNode
}

/**
 * 工具页专用错误边界：渲染期异常仅影响当前工具卡片，不拖垮整站布局与其它区块。
 * 不捕获：异步回调内未上报的异常、Web Worker 外部逻辑、主线程死循环（须靠 Worker/限长规避）。
 */
export function ToolErrorBoundary({ toolTitle, children }: ToolErrorBoundaryProps) {
  return (
    <UiErrorBoundary
      sectionLabel={`${toolTitle}`}
      className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-center shadow-sm"
    >
      {children}
    </UiErrorBoundary>
  )
}
