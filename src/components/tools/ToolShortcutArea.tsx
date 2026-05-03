'use client'

import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import { onToolInputShortcut, type ToolInputShortcutOptions } from '@/lib/tools/tool-input-shortcut'
import { ToolRunShortcutHint } from '@/components/tools/ToolRunShortcutHint'

/** 快捷键聚焦「输出区」：原生控件或 ToolCodeMirror 通过 focus() 暴露 */
export type ToolOutputFocusHandle = Pick<HTMLElement, 'focus'>

function isShortcutEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false
  if (t instanceof HTMLTextAreaElement) return !(t.readOnly || t.disabled)
  if (t instanceof HTMLInputElement) {
    if (t.readOnly || t.disabled) return false
    const skip = new Set(['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden', 'image'])
    return !skip.has(t.type)
  }
  if (t.isContentEditable) return true
  return false
}

type ToolShortcutAreaProps = {
  children: ReactNode
  className?: string
  hintClassName?: string
  hintVariant?: 'run-or-focus' | 'focus-only'
  /** 为 false 时不渲染底部提示（可在页面内自定义位置） */
  showShortcutHint?: boolean
} & Omit<ToolInputShortcutOptions, 'focusRef'> & {
    focusRef?: RefObject<ToolOutputFocusHandle | null>
  }

/**
 * 在区域内捕获键盘事件：可编辑控件或（可选）只读结果区在提供 run 时也可触发执行。
 */
export function ToolShortcutArea({
  children,
  className,
  hintClassName = 'mt-4',
  hintVariant = 'run-or-focus',
  showShortcutHint = true,
  run,
  canRun,
  focusRef,
}: ToolShortcutAreaProps) {
  const onCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    const t = e.target
    if (!(t instanceof HTMLElement)) return

    const readonlyTextareaWithRun =
      t instanceof HTMLTextAreaElement && t.readOnly && typeof run === 'function'

    if (!readonlyTextareaWithRun && !isShortcutEditableTarget(t)) return

    onToolInputShortcut(e as KeyboardEvent<HTMLElement>, { run, canRun, focusRef })
  }

  return (
    <div className={className} onKeyDownCapture={onCapture}>
      {children}
      {showShortcutHint ? <ToolRunShortcutHint variant={hintVariant} className={hintClassName} /> : null}
    </div>
  )
}
