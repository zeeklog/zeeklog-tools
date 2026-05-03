/** 解析简单 INSERT INTO t (a,b) VALUES (...),(...) 为表格数据（不支持子查询、SELECT 插入等） */

export type SqlInsertTable = { columns: string[]; rows: string[][] }

function stripSqlComments(s: string): string {
  return s
    .replace(/^\uFEFF/, '')
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
}

function splitFields(inner: string): string[] {
  const fields: string[] = []
  let cur = ''
  let depth = 0
  let q: string | null = null
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    if (q) {
      if (c === '\\' && i + 1 < inner.length) {
        cur += c + inner[++i]
        continue
      }
      if (c === q) {
        q = null
      }
      cur += c
      continue
    }
    if (c === "'" || c === '"') {
      q = c
      cur += c
      continue
    }
    if (c === '(') {
      depth++
      cur += c
      continue
    }
    if (c === ')') {
      depth--
      cur += c
      continue
    }
    if (c === ',' && depth === 0) {
      fields.push(trimSqlValue(cur))
      cur = ''
      continue
    }
    cur += c
  }
  if (cur.trim() !== '') fields.push(trimSqlValue(cur))
  return fields
}

function trimSqlValue(v: string): string {
  const t = v.trim()
  if (t.toUpperCase() === 'NULL') return ''
  if (
    (t.startsWith("'") && t.endsWith("'")) ||
    (t.startsWith('"') && t.endsWith('"'))
  ) {
    const inner = t.slice(1, -1)
    if (t.startsWith("'")) return inner.replace(/''/g, "'")
    return inner.replace(/""/g, '"')
  }
  return t
}

function splitValueRows(valuesClause: string): string[][] {
  let s = valuesClause.trim()
  if (s.endsWith(';')) s = s.slice(0, -1).trim()
  const rowStrings: string[] = []
  let i = 0
  while (i < s.length && /\s/.test(s[i]!)) i++
  while (i < s.length) {
    if (s[i] !== '(') break
    const start = i
    let depth = 0
    let q: string | null = null
    let closed = false
    for (; i < s.length; i++) {
      const c = s[i]!
      if (q) {
        if (c === '\\' && i + 1 < s.length) {
          i++
          continue
        }
        if (c === q) q = null
        continue
      }
      if (c === "'" || c === '"') {
        q = c
        continue
      }
      if (c === '(') depth++
      if (c === ')') {
        depth--
        if (depth === 0) {
          rowStrings.push(s.slice(start + 1, i))
          i++
          closed = true
          break
        }
      }
    }
    if (!closed) break
    while (i < s.length && /\s/.test(s[i]!)) i++
    if (i < s.length && s[i] === ',') {
      i++
      while (i < s.length && /\s/.test(s[i]!)) i++
      continue
    }
    break
  }
  return rowStrings.map((inner) => splitFields(inner))
}

export function parseInsertSql(sql: string): SqlInsertTable | { error: string } {
  const cleaned = stripSqlComments(sql).trim()
  if (!cleaned) return { error: '请输入 SQL' }
  const m = cleaned.match(
    /INSERT\s+INTO\s+[`"']?([\w.]+)[`"']?\s*\(([^)]*)\)\s*VALUES\s*/is
  )
  if (!m) {
    return {
      error:
        '仅支持 INSERT INTO 表名 (列1,列2,…) VALUES (…),(…) 形式。不支持 SELECT、子查询、存储过程等。',
    }
  }
  const colPart = m[2]!
  const columns = colPart
    .split(',')
    .map((c) => c.trim().replace(/^[`"']|[`"']$/g, ''))
    .filter(Boolean)
  if (columns.length === 0) return { error: '未解析到列名' }
  const rest = cleaned.slice(m.index! + m[0].length)
  const rows = splitValueRows(rest)
  if (rows.length === 0) return { error: '未解析到 VALUES 行' }
  for (let r = 0; r < rows.length; r++) {
    if (rows[r]!.length !== columns.length) {
      return {
        error: `第 ${r + 1} 行字段数为 ${rows[r]!.length}，与列数 ${columns.length} 不一致`,
      }
    }
  }
  return { columns, rows }
}

export function tableToCsv(columns: string[], rows: string[][]): string {
  const esc = (c: string) => {
    if (/[",\n\r]/.test(c)) return `"${c.replace(/"/g, '""')}"`
    return c
  }
  return [columns.map(esc).join(','), ...rows.map((row) => row.map(esc).join(','))].join('\n')
}

export function tableToJson(columns: string[], rows: string[][]): string {
  const objs = rows.map((row) => {
    const o: Record<string, string> = {}
    columns.forEach((col, i) => {
      o[col] = row[i] ?? ''
    })
    return o
  })
  return JSON.stringify(objs, null, 2)
}

function xmlSafeTag(name: string): string {
  const t = name.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/^-+/, 'c')
  return t.match(/^[a-zA-Z_]/) ? t : `c${t}`
}

export function tableToXml(columns: string[], rows: string[][]): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const tags = columns.map(xmlSafeTag)
  const rowEls = rows
    .map((row) => {
      const cells = tags
        .map((tag, i) => `    <${tag}>${esc(row[i] ?? '')}</${tag}>`)
        .join('\n')
      return `  <row>\n${cells}\n  </row>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${rowEls}\n</rows>`
}

export function tableToHtml(columns: string[], rows: string[][]): string {
  const th = columns.map((c) => `<th>${escapeHtmlCell(c)}</th>`).join('')
  const trs = rows
    .map((row) => `<tr>${row.map((c) => `<td>${escapeHtmlCell(c)}</td>`).join('')}</tr>`)
    .join('')
  return `<table>\n<thead><tr>${th}</tr></thead>\n<tbody>${trs}</tbody>\n</table>`
}

function escapeHtmlCell(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
