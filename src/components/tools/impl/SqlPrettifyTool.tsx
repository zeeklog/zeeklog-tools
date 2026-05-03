'use client'

import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function SqlPrettifyTool() {
  const [raw, setRaw] = useState('SELECT * FROM users WHERE id=1')
  const [dialect, setDialect] = useState<'sql' | 'mysql' | 'postgresql' | 'sqlite'>('sql')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const sqlFormatterRef = useRef<typeof import('sql-formatter') | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!sqlFormatterRef.current) {
        sqlFormatterRef.current = await import('sql-formatter')
      }
      const { format: formatSql } = sqlFormatterRef.current
      if (cancelled) return
      try {
        setOut(raw.trim() === '' ? '' : formatSql(raw, { language: dialect, tabWidth: 2 }))
        setErr('')
      } catch (e) {
        setOut('')
        setErr(e instanceof Error ? e.message : '格式化失败')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [raw, dialect])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <select
        value={dialect}
        onChange={(e) => setDialect(e.target.value as typeof dialect)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
      >
        <option value="sql">SQL</option>
        <option value="mysql">MySQL</option>
        <option value="postgresql">PostgreSQL</option>
        <option value="sqlite">SQLite</option>
      </select>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          SQL
          <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language="sql" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          格式化结果
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="sql" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
