'use client'

import { evaluate } from 'mathjs'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'

export function MathEvaluatorTool() {
  const [expr, setExpr] = useState('2 + 2 * 3')
  const outRef = useRef<HTMLParagraphElement>(null)
  const { out, err } = useMemo(() => {
    try {
      return { out: String(evaluate(expr)), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : '计算错误' }
    }
  }, [expr])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <ToolCodeMirror value={expr} onChange={setExpr} rows={3} language="plaintext" variant="in" />
      <p
        ref={outRef}
        tabIndex={-1}
        aria-live="polite"
        className={`rounded-xl border px-4 py-4 font-mono text-lg outline-none ring-orange-100 focus:ring-2 ${
          err ? 'border-red-100 bg-red-50/80 text-red-800' : 'border-slate-100 bg-slate-50/90 text-slate-900'
        }`}
      >
        {err || out}
      </p>
    </ToolShortcutArea>
  )
}
