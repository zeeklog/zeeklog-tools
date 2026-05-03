/** 浏览器内工具运行时限制：防 OOM、长时间主线程阻塞（与 docs/tools-runtime-security.md 一致） */

/** 单工具输入框建议上限（字符数），超大文本应使用本地 CLI / IDE */
export const TOOL_MAX_INPUT_CHARS = 400_000

export function assertInputWithinLimit(text: string, maxChars: number = TOOL_MAX_INPUT_CHARS): string | null {
  if (text.length <= maxChars) return null
  return `输入过长（当前 ${text.length.toLocaleString('zh-CN')} 字符），请控制在 ${maxChars.toLocaleString('zh-CN')} 字符以内，或使用本地工具处理大文件。`
}
