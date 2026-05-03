import type { KeyboardEvent, RefObject } from 'react'

/** 与 ToolShortcutArea / ToolCodeMirror 输出聚焦一致 */
export type ToolFocusableRef = Pick<HTMLElement, 'focus'>

export type ToolInputShortcutOptions = {
  run?: () => void
  canRun?: boolean
  focusRef?: RefObject<ToolFocusableRef | null>
}

/**
 * 在可编辑区域：Ctrl+Enter / ⌘+Enter
 * - 若提供 run 且 canRun 不为 false，则执行 run
 * - 否则若提供 focusRef，则聚焦输出区（只读区等）
 */
export function onToolInputShortcut(
  e: KeyboardEvent<HTMLElement>,
  opts: ToolInputShortcutOptions
): void {
  if (e.key !== 'Enter') return
  if (!e.ctrlKey && !e.metaKey) return

  const hasRun = typeof opts.run === 'function'
  const allowRun = hasRun && opts.canRun !== false
  if (allowRun && opts.run) {
    e.preventDefault()
    opts.run()
    return
  }

  const el = opts.focusRef?.current
  if (el && typeof el.focus === 'function') {
    e.preventDefault()
    el.focus()
  }
}
