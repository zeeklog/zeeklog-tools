'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { generateRandomMacAddress } from '@/lib/tools/logic/mac-address'

const seps = [
  { label: ':', value: ':' },
  { label: '-', value: '-' },
  { label: '.', value: '.' },
  { label: '无', value: '' },
]

export function MacAddressGeneratorTool() {
  const [prefix, setPrefix] = useState('64:16:7F')
  const [sep, setSep] = useState(':')
  const [count, setCount] = useState(3)
  const [tick, setTick] = useState(0)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const lines = useMemo(() => {
    const n = Math.min(50, Math.max(1, count))
    return Array.from({ length: n }, () =>
      generateRandomMacAddress({ prefix, separator: sep }).toUpperCase(),
    ).join('\n')
  }, [prefix, sep, count, tick])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        前缀（十六进制字节）
        <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className={toolInputClass} />
      </label>
      <label className={toolLabelClass}>
        数量
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="mt-1 w-24 rounded border px-2 py-1"
        />
      </label>
      <label className={toolLabelClass}>
        分隔符
        <select value={sep} onChange={(e) => setSep(e.target.value)} className="mt-1 block rounded border px-2 py-1">
          {seps.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={() => setTick((t) => t + 1)} className="rounded bg-orange-500 px-3 py-1.5 text-sm text-white">
        重新生成
      </button>
      <ToolCodeMirror
        ref={outRef}
        readOnly
        value={lines}
        rows={Math.min(12, count + 2)}
        language="plaintext"
        variant="out"
      />
    </ToolShortcutArea>
  )
}
