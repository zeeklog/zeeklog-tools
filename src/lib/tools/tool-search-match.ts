import type { ToolDefinition } from '@/lib/tools/types'

function normalize(s: string) {
  return s.trim().toLowerCase()
}

/**
 * 去掉空白后再比（与 normalize 后一致的小写）。
 * 解决用户输入「png转ico」与文案「PNG 转 ICO」之间多空格/无空格不一致导致搜不到的问题。
 */
function compactIgnoreWhitespace(s: string) {
  return normalize(s).replace(/\s+/g, '')
}

/** 与工具列表页一致的匹配：标题、简介、slug、slug 转空格 */
export function toolMatchesSearchQuery(tool: ToolDefinition, q: string): boolean {
  if (!q.trim()) return true
  const n = normalize(q)
  if (normalize(tool.title).includes(n)) return true
  if (normalize(tool.description).includes(n)) return true
  if (normalize(tool.slug).includes(n)) return true
  if (normalize(tool.slug.replace(/-/g, ' ')).includes(n)) return true

  const cq = compactIgnoreWhitespace(q)
  if (cq.length === 0) return false
  if (compactIgnoreWhitespace(tool.title).includes(cq)) return true
  if (compactIgnoreWhitespace(tool.description).includes(cq)) return true
  return false
}
