'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolInputReadonlyClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { buildCaseFormats } from '@/lib/tools/logic/case-converter'

export function CaseConverterTool() {
  const [input, setInput] = useState('lorem ipsum dolor sit amet')
  const [hint, setHint] = useState('')
  const firstOutRef = useRef<HTMLInputElement>(null)

  const formats = useMemo(() => buildCaseFormats(input), [input])

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 1500)
  }

  return (
    <ToolShortcutArea focusRef={firstOutRef} className="space-y-6">
      <label className={toolLabelClass}>
        原始字符串
        <ToolCodeMirror value={input} onChange={setInput} rows={3} language="plaintext" variant="in" />
      </label>
      <div className="space-y-3">
        {formats.map((f, i) => (
          <div key={f.label} className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <span className="w-40 shrink-0 text-right text-sm font-medium text-slate-600">{f.label}</span>
            <input
              ref={i === 0 ? firstOutRef : undefined}
              readOnly
              value={f.value}
              className={`min-w-0 flex-1 ${toolInputReadonlyClass}`}
            />
            <button
              type="button"
              onClick={() => copy(f.value)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-orange-200 hover:bg-orange-50"
            >
              复制
            </button>
          </div>
        ))}
      </div>
      {hint ? <p className="text-center text-sm text-slate-600">{hint}</p> : null}
    </ToolShortcutArea>
  )
}
