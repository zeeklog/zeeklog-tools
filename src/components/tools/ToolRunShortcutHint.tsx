'use client'

import { useIsApplePlatform } from '@/lib/tools/use-is-apple-platform'

type ToolRunShortcutHintProps = {
  /** 有主动作时文案略不同 */
  variant?: 'run-or-focus' | 'focus-only'
  className?: string
}

const kbd =
  'rounded-md border border-slate-200/90 bg-slate-100/90 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-800 shadow-sm'

export function ToolRunShortcutHint({ variant = 'run-or-focus', className = '' }: ToolRunShortcutHintProps) {
  const apple = useIsApplePlatform()

  const tail =
    variant === 'focus-only'
      ? '跳转到结果区'
      : '执行主操作；若无按钮则跳转到结果区'

  return (
    <p className={`text-center text-[11px] text-slate-500 ${className}`.trim()} role="note">
      {apple ? (
        <>
          快捷键：<kbd className={kbd}>⌘</kbd> + <kbd className={kbd}>Enter</kbd> {tail}
        </>
      ) : (
        <>
          快捷键：<kbd className={kbd}>Ctrl</kbd> + <kbd className={kbd}>Enter</kbd> {tail}
        </>
      )}
    </p>
  )
}
