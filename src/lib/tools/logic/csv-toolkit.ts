import Papa from 'papaparse'

export function csvToRows(csv: string): { headers: string[]; rows: string[][] } {
  const r = Papa.parse<string[]>(csv, { header: false, skipEmptyLines: false })
  const data = (r.data as string[][]).filter((row) => row.some((c) => String(c).trim() !== ''))
  if (data.length === 0) return { headers: [], rows: [] }
  const headers = data[0]!.map((h) => String(h))
  const rows = data.slice(1).map((row) => {
    const out: string[] = []
    for (let i = 0; i < headers.length; i++) {
      out.push(row[i] != null ? String(row[i]) : '')
    }
    return out
  })
  return { headers, rows }
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  return Papa.unparse({ fields: headers, data: rows })
}

export function rowsToTsv(headers: string[], rows: string[][]): string {
  const esc = (s: string) => s.replace(/\t/g, ' ').replace(/\n/g, ' ')
  return [headers.map(esc).join('\t'), ...rows.map((row) => row.map(esc).join('\t'))].join('\n')
}

export function rowsToJson(headers: string[], rows: string[][]): string {
  const objs = rows.map((row) => {
    const o: Record<string, string> = {}
    headers.forEach((h, i) => {
      o[h] = row[i] ?? ''
    })
    return o
  })
  return JSON.stringify(objs, null, 2)
}

export function rowsToHtmlTable(headers: string[], rows: string[][]): string {
  const th = headers.map((h) => `<th>${escape(h)}</th>`).join('')
  const trs = rows
    .map((row) => `<tr>${row.map((c) => `<td>${escape(c)}</td>`).join('')}</tr>`)
    .join('')
  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
