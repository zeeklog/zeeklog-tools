function getHeaders(array: Record<string, unknown>[]): string[] {
  const headers = new Set<string>()
  array.forEach((item) => Object.keys(item).forEach((key) => headers.add(key)))
  return Array.from(headers)
}

function serializeValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return ''
  const valueAsString = String(value).replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')
  if (valueAsString.includes(',')) {
    return `"${valueAsString}"`
  }
  return valueAsString
}

export function convertArrayToCsv(array: Record<string, unknown>[]): string {
  const headers = getHeaders(array)
  const rows = array.map((item) => headers.map((header) => serializeValue(item[header])))
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}
