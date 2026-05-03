'use client'

import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function YamlPrettifyTool() {
  const [raw, setRaw] = useState('a: 1\nb:\n  c: 2')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const yamlModRef = useRef<typeof import('yaml') | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!yamlModRef.current) {
        yamlModRef.current = await import('yaml')
      }
      const { parse: parseYaml, stringify: stringifyYaml } = yamlModRef.current
      if (cancelled) return
      try {
        if (raw.trim() === '') {
          setOut('')
          setErr('')
          return
        }
        const obj = parseYaml(raw)
        setOut(stringifyYaml(obj, { indent: 2 }))
        setErr('')
      } catch (e) {
        setOut('')
        setErr(e instanceof Error ? e.message : 'YAML 无效')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [raw])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          YAML 输入
          <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language="yaml" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          格式化结果
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="yaml" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
