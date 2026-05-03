export type JsonJsonlResult =
  | { ok: true; text: string }
  | { ok: false; message: string }

/** 将 JSON 数组或单行对象转为 JSONL（每行一条合法 JSON） */
export function jsonToJsonl(input: string): JsonJsonlResult {
  const t = input.trim()
  if (t === '') return { ok: true, text: '' }
  let data: unknown
  try {
    data = JSON.parse(t)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: `JSON 解析失败：${msg}` }
  }
  if (Array.isArray(data)) {
    const lines: string[] = []
    for (let i = 0; i < data.length; i++) {
      try {
        lines.push(JSON.stringify(data[i]))
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        return { ok: false, message: `第 ${i + 1} 项无法序列化：${msg}` }
      }
    }
    return { ok: true, text: lines.join('\n') }
  }
  return { ok: true, text: JSON.stringify(data) }
}

/** 将 JSONL（每行一条 JSON）合并为 JSON 数组 */
export function jsonlToJsonArray(input: string): JsonJsonlResult {
  const lines = input.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) return { ok: true, text: '[]' }
  const items: unknown[] = []
  for (let i = 0; i < lines.length; i++) {
    try {
      items.push(JSON.parse(lines[i]))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { ok: false, message: `第 ${i + 1} 行解析失败：${msg}` }
    }
  }
  return { ok: true, text: JSON.stringify(items, null, 2) }
}
