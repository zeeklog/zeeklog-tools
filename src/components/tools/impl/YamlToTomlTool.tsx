'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { yamlToToml } from '@/lib/tools/logic/structured-data'

export function YamlToTomlTool() {
  const locale = useToolLocale()
  const [yaml, setYaml] = useState('a: 1')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: yaml.trim() === '' ? '' : yamlToToml(yaml), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : locale === 'zh' ? '转换失败' : 'Conversion failed' }
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
          TOML
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="toml" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
