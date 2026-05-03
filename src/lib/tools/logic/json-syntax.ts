export type JsonSyntaxReport =
  | { ok: true }
  | {
      ok: false
      message: string
      line: number
      column: number
      excerpt: string
    }

function lineColumnAt(text: string, index: number): { line: number; column: number } {
  let line = 1
  let col = 1
  for (let i = 0; i < index && i < text.length; i++) {
    const c = text[i]
    if (c === '\n') {
      line++
      col = 1
    } else {
      col++
    }
  }
  return { line, column: col }
}

function excerptAround(text: string, index: number, radius = 40): string {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + radius)
  const slice = text.slice(start, end).replace(/\n/g, '↵')
  return slice
}

/** 尝试 JSON.parse，失败时尽量给出行号与片段（依赖引擎错误信息中的 position） */
export function analyzeJsonSyntax(text: string): JsonSyntaxReport {
  const t = text.trim()
  if (t === '') return { ok: true }
  try {
    JSON.parse(t)
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const posMatch = /position\s+(\d+)/i.exec(msg)
    const lineMatch = /line\s+(\d+)\s+column\s+(\d+)/i.exec(msg)
    let line = 1
    let column = 1
    if (posMatch) {
      const idx = Number(posMatch[1])
      if (Number.isFinite(idx)) {
        const lc = lineColumnAt(text, idx)
        line = lc.line
        column = lc.column
        return {
          ok: false,
          message: msg,
          line,
          column,
          excerpt: excerptAround(text, idx),
        }
      }
    }
    if (lineMatch) {
      line = Number(lineMatch[1]) || 1
      column = Number(lineMatch[2]) || 1
    }
    return {
      ok: false,
      message: msg,
      line,
      column,
      excerpt: excerptAround(text, 0),
    }
  }
}
