'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { jsonToYaml } from '@/lib/tools/logic/structured-data'

export function JsonToYamlConverterTool() {
  const [json, setJson] = useState('{"a":1}')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: json.trim() === '' ? '' : jsonToYaml(json), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : 'JSON 无效' }
    }
  }, [json])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          JSON
          <ToolCodeMirror value={json} onChange={setJson} rows={12} language="json" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          YAML
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="yaml" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
