'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { csvToRows, rowsToCsv, rowsToHtmlTable, rowsToJson, rowsToTsv } from '@/lib/tools/logic/csv-toolkit'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE = `name,age
Alice,30
Bob,25`

type Tab = 'json' | 'tsv' | 'html'

export function CsvToolkitTool() {
  const [csv, setCsv] = useState(SAMPLE)
  const [tab, setTab] = useState<Tab>('json')
  const limitMsg = assertInputWithinLimit(csv)

  const { out, err } = useMemo(() => {
    if (limitMsg) return { out: '', err: '' as string }
    try {
      const { headers, rows } = csvToRows(csv)
      if (headers.length === 0) return { out: '', err: '无有效表头行' }
      switch (tab) {
        case 'json':
          return { out: rowsToJson(headers, rows), err: '' }
        case 'tsv':
          return { out: rowsToTsv(headers, rows), err: '' }
        case 'html':
          return { out: rowsToHtmlTable(headers, rows), err: '' }
        default:
          return { out: '', err: '' }
      }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [csv, tab, limitMsg])

  const outLang: ToolCodemirrorLang = tab === 'json' ? 'json' : tab === 'html' ? 'html' : 'plaintext'

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        首行为表头。与{' '}
        <Link href="/tools/json-to-csv" className="text-orange-700 underline">
          JSON 转 CSV
        </Link>{' '}
        可配合使用。
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        {(['json', 'tsv', 'html'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 uppercase ${tab === t ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            CSV
            <ToolCodeMirror value={csv} onChange={setCsv} rows={10} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            输出
            <ToolCodeMirror readOnly value={out} rows={14} language={outLang} variant="out" />
          </label>
        </div>
      </div>
    </div>
  )
}
