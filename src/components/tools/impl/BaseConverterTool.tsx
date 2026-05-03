'use client'

import type { Ref } from 'react'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { toolInputClass, toolInputReadonlyClass, toolLabelClass } from '@/components/tools/tool-field-classes'
import { convertBase } from '@/lib/tools/logic/integer-base'

function safeConvert(value: string, fromBase: number, toBase: number): string {
  try {
    return convertBase({ value, fromBase, toBase })
  } catch {
    return ''
  }
}

function convertError(value: string, fromBase: number, toBase: number): string {
  try {
    convertBase({ value, fromBase, toBase })
    return ''
  } catch (e) {
    return e instanceof Error ? e.message : String(e)
  }
}

export function BaseConverterTool() {
  const [input, setInput] = useState('42')
  const [inputBase, setInputBase] = useState(10)
  const [outputBase, setOutputBase] = useState(42)
  const firstOutRef = useRef<HTMLInputElement>(null)

  const error = useMemo(() => convertError(input, inputBase, outputBase), [input, inputBase, outputBase])

  const row = (label: string, base: number, outRef?: Ref<HTMLInputElement>) => (
    <label className={toolLabelClass} key={base}>
      <span className="text-slate-600">{label}</span>
      <div className="mt-1 flex gap-2">
        <input
          ref={outRef}
          readOnly
          value={safeConvert(input, inputBase, base)}
          className={`min-w-0 flex-1 ${toolInputReadonlyClass}`}
        />
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(safeConvert(input, inputBase, base))}
          className="shrink-0 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1.5 text-xs font-medium text-orange-900 hover:bg-orange-100"
        >
          复制
        </button>
      </div>
    </label>
  )

  return (
    <ToolShortcutArea focusRef={firstOutRef} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={toolLabelClass}>
          输入数字
          <input value={input} onChange={(e) => setInput(e.target.value)} className={toolInputClass} />
        </label>
        <label className={toolLabelClass}>
          输入进制 (2–64)
          <input
            type="number"
            min={2}
            max={64}
            value={inputBase}
            onChange={(e) => setInputBase(Number(e.target.value))}
            className={toolInputClass}
          />
        </label>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-3">
        {row('Binary (2)', 2, firstOutRef)}
        {row('Octal (8)', 8)}
        {row('Decimal (10)', 10)}
        {row('Hexadecimal (16)', 16)}
        {row('Base64 (64)', 64)}
      </div>

      <div className="space-y-2">
        <label className={`${toolLabelClass} text-sm`}>
          自定义输出进制 (2–64)
          <input
            type="number"
            min={2}
            max={64}
            value={outputBase}
            onChange={(e) => setOutputBase(Number(e.target.value))}
            className="ml-2 w-24 rounded-xl border border-slate-200 px-2 py-1.5 font-mono text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </label>
        {row(`Base ${outputBase}`, outputBase)}
      </div>
    </ToolShortcutArea>
  )
}
