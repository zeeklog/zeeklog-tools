'use client'

import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { buildHtmlTable, extractFirstTableFromHtml } from '@/lib/tools/logic/html-table-utils'
import { rowsToCsv } from '@/lib/tools/logic/csv-toolkit'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Tab = 'gen' | 'extract'

export function HtmlTableToolsTool() {
  const locale = useToolLocale()
  const [tab, setTab] = useState<Tab>('gen')
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [htmlIn, setHtmlIn] = useState('<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>')
  const limitExtract = assertInputWithinLimit(htmlIn)

  const generated = useMemo(() => {
    const headers = Array.from({ length: cols }, (_, i) => (locale === 'zh' ? `列${i + 1}` : `Col${i + 1}`))
    const data = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''))
    return buildHtmlTable(headers, data)
  }, [rows, cols, locale])

  const { csvOut, extractErr } = useMemo(() => {
    if (typeof document === 'undefined') return { csvOut: '', extractErr: '' as string }
    if (limitExtract) return { csvOut: '', extractErr: '' as string }
    try {
      const t = extractFirstTableFromHtml(htmlIn)
      if (!t) return { csvOut: '', extractErr: locale === 'zh' ? '未找到 table 或表格为空' : 'No table found, or the table is empty' }
      return { csvOut: rowsToCsv(t.headers, t.rows), extractErr: '' }
    } catch (e) {
      return { csvOut: '', extractErr: e instanceof Error ? e.message : String(e) }
    }
  }, [htmlIn, limitExtract, locale])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => setTab('gen')}
          className={`rounded-lg border px-3 py-1.5 ${tab === 'gen' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
        >
          {locale === 'zh' ? '生成空表 HTML' : 'Generate empty table HTML'}
        </button>
        <button
          type="button"
          onClick={() => setTab('extract')}
          className={`rounded-lg border px-3 py-1.5 ${tab === 'extract' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
        >
          {locale === 'zh' ? '从 HTML 抽表格 → CSV' : 'Extract table from HTML → CSV'}
        </button>
      </div>

      {tab === 'gen' ? (
        <div className={toolSectionClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={toolLabelClass}>
              {locale === 'zh' ? '行数' : 'Rows'}
              <input
                type="number"
                min={1}
                max={50}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className={toolInputClass}
              />
            </label>
            <label className={toolLabelClass}>
              {locale === 'zh' ? '列数' : 'Columns'}
              <input
                type="number"
                min={1}
                max={20}
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className={toolInputClass}
              />
            </label>
          </div>
          <label className={toolLabelClass}>
            HTML
            <ToolCodeMirror readOnly value={generated} rows={10} language="html" variant="out" />
          </label>
        </div>
      ) : (
        <div className={toolSectionClass}>
          {limitExtract && <p className="text-sm text-amber-800">{limitExtract}</p>}
          {extractErr && <p className="text-sm text-red-600">{extractErr}</p>}
          <div className={toolConverterEditorGridClass}>
            <label className={toolLabelClass}>
              {locale === 'zh' ? 'HTML（含 table）' : 'HTML (with table)'}
              <ToolCodeMirror value={htmlIn} onChange={setHtmlIn} rows={10} language="html" variant="in" />
            </label>
            <label className={toolLabelClass}>
              CSV
              <ToolCodeMirror readOnly value={csvOut} rows={8} language="plaintext" variant="out" />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
