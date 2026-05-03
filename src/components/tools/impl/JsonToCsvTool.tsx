'use client'

import JSON5 from 'json5'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { convertArrayToCsv } from '@/lib/tools/logic/json-to-csv'

export function JsonToCsvTool() {
  const [raw, setRaw] = useState('[{"a":1,"b":"x"},{"a":2,"b":"y"}]')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      if (raw.trim() === '') return { out: '', err: '' }
      const parsed = JSON5.parse(raw)
      if (!Array.isArray(parsed)) {
        return { out: '', err: 'JSON 须为对象数组' }
      }
      if (!parsed.every((x) => x !== null && typeof x === 'object' && !Array.isArray(x))) {
        return { out: '', err: '数组元素须均为对象' }
      }
      return { out: convertArrayToCsv(parsed as Record<string, unknown>[]), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : '无效 JSON' }
    }
  }, [raw])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          JSON 数组
          <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language="json" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          CSV
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="plaintext" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
