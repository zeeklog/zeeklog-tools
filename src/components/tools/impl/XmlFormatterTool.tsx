'use client'

import formatXml from 'xml-formatter'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function XmlFormatterTool() {
  const [raw, setRaw] = useState('<root><a>1</a></root>')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: raw.trim() === '' ? '' : formatXml(raw, { indentation: '  ', collapseContent: true }), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : 'XML 无效' }
    }
  }, [raw])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          XML
          <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language="xml" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          格式化结果
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="xml" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
