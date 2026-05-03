'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { tomlToJson } from '@/lib/tools/logic/structured-data'

export function TomlToJsonTool() {
  const [toml, setToml] = useState('a = 1')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: toml.trim() === '' ? '' : tomlToJson(toml), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : 'TOML 无效' }
    }
  }, [toml])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          TOML
          <ToolCodeMirror value={toml} onChange={setToml} rows={12} language="toml" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          JSON
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="json" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
