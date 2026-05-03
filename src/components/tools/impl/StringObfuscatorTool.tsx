'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { obfuscateString } from '@/lib/tools/logic/obfuscate-string'

export function StringObfuscatorTool() {
  const [str, setStr] = useState('Lorem ipsum dolor sit amet')
  const [keepFirst, setKeepFirst] = useState(4)
  const [keepLast, setKeepLast] = useState(4)
  const [keepSpace, setKeepSpace] = useState(true)
  const [replacement, setReplacement] = useState('*')
  const [hint, setHint] = useState('')
  const outRef = useRef<HTMLDivElement>(null)

  const obfuscated = useMemo(
    () =>
      obfuscateString(str, {
        replacementChar: replacement.slice(0, 1) || '*',
        keepFirst: Math.max(0, keepFirst),
        keepLast: Math.max(0, keepLast),
        keepSpace,
      }),
    [str, keepFirst, keepLast, keepSpace, replacement],
  )

  const copy = async () => {
    await navigator.clipboard.writeText(obfuscated)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        原文
        <ToolCodeMirror value={str} onChange={setStr} rows={3} language="plaintext" variant="in" />
      </label>
      <div className="flex flex-wrap gap-6">
        <label className="text-sm text-gray-700">
          保留前 N 个字符
          <input
            type="number"
            min={0}
            value={keepFirst}
            onChange={(e) => setKeepFirst(Number(e.target.value))}
            className="ml-2 w-24 rounded-lg border border-gray-200 px-2 py-1"
          />
        </label>
        <label className="text-sm text-gray-700">
          保留后 N 个字符
          <input
            type="number"
            min={0}
            value={keepLast}
            onChange={(e) => setKeepLast(Number(e.target.value))}
            className="ml-2 w-24 rounded-lg border border-gray-200 px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="h-4 w-4" checked={keepSpace} onChange={(e) => setKeepSpace(e.target.checked)} />
          保留空格
        </label>
        <label className="text-sm text-gray-700">
          替换字符
          <input
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            maxLength={4}
            className="ml-2 w-16 rounded-lg border border-gray-200 px-2 py-1 font-mono"
          />
        </label>
      </div>
      <div
        ref={outRef}
        tabIndex={-1}
        className="flex max-w-2xl items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 font-mono text-sm break-all outline-none focus:ring-2 focus:ring-orange-100"
      >
        <span className="min-w-0 flex-1">{obfuscated}</span>
        <button type="button" onClick={copy} className="shrink-0 rounded border border-gray-300 px-2 py-1 text-xs">
          复制
        </button>
      </div>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </ToolShortcutArea>
  )
}
