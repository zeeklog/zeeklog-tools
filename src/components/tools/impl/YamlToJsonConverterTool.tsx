'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { yamlToJson } from '@/lib/tools/logic/structured-data'

export function YamlToJsonConverterTool() {
  const locale = useToolLocale()
  const [yaml, setYaml] = useState('hello: world')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: yaml.trim() === '' ? '' : yamlToJson(yaml), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : locale === 'zh' ? 'YAML 无效' : 'Invalid YAML' }
    }
  }, [yaml, locale])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          YAML
          <ToolCodeMirror value={yaml} onChange={setYaml} rows={12} language="yaml" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          JSON
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="json" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
