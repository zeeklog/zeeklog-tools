'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  parseInsertSql,
  tableToCsv,
  tableToHtml,
  tableToJson,
  tableToXml,
} from '@/lib/tools/logic/sql-insert-parse'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE = `INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob');`

type OutTab = 'csv' | 'json' | 'yaml' | 'xml' | 'html'

export function SqlToDataFormatsTool() {
  const [sql, setSql] = useState(SAMPLE)
  const [tab, setTab] = useState<OutTab>('csv')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [yamlPending, setYamlPending] = useState(false)
  const yamlModRef = useRef<typeof import('yaml') | null>(null)
  const limitMsg = assertInputWithinLimit(sql)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (limitMsg) {
        setOut('')
        setErr('')
        setYamlPending(false)
        return
      }
      const p = parseInsertSql(sql)
      if ('error' in p) {
        setOut('')
        setErr(p.error)
        setYamlPending(false)
        return
      }
      const { columns, rows } = p
      const objs = rows.map((row) => {
        const o: Record<string, string> = {}
        columns.forEach((c, i) => {
          o[c] = row[i] ?? ''
        })
        return o
      })
      try {
        if (tab === 'yaml') {
          setYamlPending(true)
          if (!yamlModRef.current) {
            yamlModRef.current = await import('yaml')
          }
          const YAML = yamlModRef.current
          if (cancelled) return
          setOut(YAML.stringify(objs))
          setErr('')
          setYamlPending(false)
          return
        }
        setYamlPending(false)
        switch (tab) {
          case 'csv':
            setOut(tableToCsv(columns, rows))
            break
          case 'json':
            setOut(tableToJson(columns, rows))
            break
          case 'xml':
            setOut(tableToXml(columns, rows))
            break
          case 'html':
            setOut(tableToHtml(columns, rows))
            break
          default:
            setOut('')
        }
        setErr('')
      } catch (e) {
        setOut('')
        setErr(e instanceof Error ? e.message : String(e))
        setYamlPending(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sql, tab, limitMsg])

  const outLang: ToolCodemirrorLang = useMemo(() => {
    switch (tab) {
      case 'json':
        return 'json'
      case 'yaml':
        return 'yaml'
      case 'xml':
        return 'xml'
      case 'html':
        return 'html'
      default:
        return 'plaintext'
    }
  }, [tab])

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        仅解析 <strong>INSERT INTO … (列…) VALUES (…),(…)</strong>。不支持 SELECT、函数默认值、多语句等。
      </p>
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {yamlPending && <p className="text-sm text-slate-600">正在准备 YAML 输出…</p>}
      <div className="flex flex-wrap gap-2 text-sm">
        {(['csv', 'json', 'yaml', 'xml', 'html'] as const).map((t) => (
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
      <div className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            SQL
            <ToolCodeMirror value={sql} onChange={setSql} rows={10} language="sql" variant="in" />
          </label>
          <label className={toolLabelClass}>
            输出
            <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language={outLang} variant="out" />
          </label>
        </div>
      </div>
    </div>
  )
}
