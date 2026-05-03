'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { formatJsonString } from '@/lib/tools/logic/json-format'

export function JsonPrettifyTool() {
  const [raw, setRaw] = useState('{"hello": "world", "foo": "bar"}')
  const [indent, setIndent] = useState(3)
  const [sortKeys, setSortKeys] = useState(true)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const { out, parseErr } = useMemo(() => {
    try {
      if (raw.trim() === '') return { out: '', parseErr: '' }
      return { out: formatJsonString(raw, sortKeys, indent), parseErr: '' }
    } catch {
      return { out: '', parseErr: 'JSON 无效' }
    }
  }, [raw, indent, sortKeys])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} />
          排序键名
        </label>
        <label className="text-sm font-medium text-slate-800">
          缩进
          <input
            type="number"
            min={0}
            max={10}
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className={`ml-2 w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100`}
          />
        </label>
      </div>
      <div className={toolConverterEditorGridClass}>
        {parseErr && <p className="text-sm text-red-600 lg:col-span-2">{parseErr}</p>}
        <label className="block text-sm font-medium text-slate-800">
          JSON 输入
          <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language="json" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          格式化结果
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={12} language="json" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
