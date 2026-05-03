export type LinePreset =
  | 'dedupe'
  | 'sort'
  | 'sort-desc'
  | 'trim-lines'
  | 'remove-empty'
  | 'remove-punctuation'
  | 'reverse-lines'

export function applyLinePreset(text: string, preset: LinePreset): string {
  const lines = text.split(/\r?\n/)
  let out: string[] = lines
  switch (preset) {
    case 'dedupe': {
      const seen = new Set<string>()
      out = []
      for (const line of lines) {
        if (seen.has(line)) continue
        seen.add(line)
        out.push(line)
      }
      break
    }
    case 'sort':
      out = [...lines].sort((a, b) => a.localeCompare(b, 'zh-CN'))
      break
    case 'sort-desc':
      out = [...lines].sort((a, b) => b.localeCompare(a, 'zh-CN'))
      break
    case 'trim-lines':
      out = lines.map((l) => l.trim())
      break
    case 'remove-empty':
      out = lines.filter((l) => l.trim() !== '')
      break
    case 'remove-punctuation':
      out = lines.map((l) => l.replace(/[\p{P}\p{S}]/gu, ''))
      break
    case 'reverse-lines':
      out = [...lines].reverse()
      break
    default:
      break
  }
  return out.join('\n')
}

export function wordFrequency(text: string): { word: string; count: number }[] {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  const m = new Map<string, number>()
  for (const w of words) {
    m.set(w, (m.get(w) ?? 0) + 1)
  }
  return [...m.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
}
