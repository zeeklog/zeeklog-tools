export function computeAverage(data: number[]): number {
  if (data.length === 0) return 0
  return data.reduce((a, b) => a + b, 0) / data.length
}

export function computeVariance(data: number[]): number {
  const mean = computeAverage(data)
  return computeAverage(data.map((value) => (value - mean) ** 2))
}

export function arrayToMarkdownTable(data: Record<string, unknown>[], headerMap: Record<string, string> = {}): string {
  if (!Array.isArray(data) || data.length === 0) return ''
  const headers = Object.keys(data[0]!)
  const headerRow = `| ${headers.map((h) => headerMap[h] ?? h).join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  const rows = data.map((obj) => `| ${headers.map((h) => String(obj[h])).join(' | ')} |`).join('\n')
  return `${headerRow}\n${sep}\n${rows}`
}
