'use client'

import JSON5 from 'json5'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function JsonMinifyTool() {
  const [raw, setRaw] = useState('{\n\t"hello": [\n\t\t"world"\n\t]\n}')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const out = useMemo(() => {
    try {
      return raw.trim() === '' ? '' : JSON.stringify(JSON5.parse(raw), null, 0)
    } catch {
      return ''
    }
  }, [raw])
  const valid =
    raw.trim() === '' ||
    (() => {
      try {
        JSON5.parse(raw)
        return true
      } catch {
        return false
      }
    })()

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {!valid && <p className="text-sm text-red-600 lg:col-span-2">JSON 无效</p>}
        <label className="block text-sm font-medium text-slate-800">
          JSON 输入
          <ToolCodeMirror value={raw} onChange={setRaw} rows={10} language="json" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          压缩结果
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={6} language="json" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
