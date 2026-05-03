/** 从 HTML 片段中提取第一个 <table> 的文本单元格（浏览器环境） */
export function extractFirstTableFromHtml(html: string): { headers: string[]; rows: string[][] } | null {
  if (typeof document === 'undefined') return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const table = doc.querySelector('table')
  if (!table) return null
  const trs = table.querySelectorAll('tr')
  const rows: string[][] = []
  trs.forEach((tr) => {
    const cells = [...tr.querySelectorAll('th,td')].map((c) => (c.textContent ?? '').trim())
    if (cells.length) rows.push(cells)
  })
  if (rows.length === 0) return null
  const headerRow = table.querySelector('thead tr')
  if (headerRow) {
    const headers = [...headerRow.querySelectorAll('th,td')].map((c) => (c.textContent ?? '').trim())
    const bodyRows = [...table.querySelectorAll('tbody tr')].map((tr) =>
      [...tr.querySelectorAll('td')].map((c) => (c.textContent ?? '').trim())
    )
    return { headers, rows: bodyRows.length ? bodyRows : rows.slice(1) }
  }
  const headers = rows[0]!
  return { headers, rows: rows.slice(1) }
}

export function buildHtmlTable(headers: string[], rows: string[][]): string {
  const th = headers.map((h) => `<th>${esc(h)}</th>`).join('')
  const trs = rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('')
  return `<table border="1">\n<thead><tr>${th}</tr></thead>\n<tbody>${trs}</tbody>\n</table>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
