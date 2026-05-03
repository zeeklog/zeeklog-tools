'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'
import { createToken } from '@/lib/tools/logic/token-generator'

export function TokenGeneratorTool() {
  const [length, setLength] = useState(64)
  const [withUppercase, setWithUppercase] = useState(true)
  const [withLowercase, setWithLowercase] = useState(true)
  const [withNumbers, setWithNumbers] = useState(true)
  const [withSymbols, setWithSymbols] = useState(false)
  const [tick, setTick] = useState(0)
  const [copyHint, setCopyHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const token = useMemo(
    () =>
      createToken({
        length,
        withUppercase,
        withLowercase,
        withNumbers,
        withSymbols,
      }),
    [length, withUppercase, withLowercase, withNumbers, withSymbols, tick],
  )

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(token)
    setCopyHint('已复制到剪贴板')
    const id = window.setTimeout(() => setCopyHint(''), 2000)
    return () => window.clearTimeout(id)
  }, [token])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-700">大写 (ABC…)</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={withUppercase}
            onChange={(e) => setWithUppercase(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-700">小写 (abc…)</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={withLowercase}
            onChange={(e) => setWithLowercase(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-700">数字 (123…)</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={withNumbers}
            onChange={(e) => setWithNumbers(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-700">符号</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={withSymbols}
            onChange={(e) => setWithSymbols(e.target.checked)}
          />
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-700">
          <span>长度</span>
          <span className="font-mono text-orange-700">{length}</span>
        </div>
        <input
          type="range"
          min={1}
          max={512}
          step={1}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-orange-600"
        />
      </div>

      <ToolCodeMirror
        ref={outRef}
        readOnly
        value={token}
        rows={3}
        language="plaintext"
        variant="out"
        placeholder="令牌…"
        className="[&_.cm-content]:text-center"
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          复制
        </button>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          刷新
        </button>
        {copyHint ? <span className="text-sm text-green-700">{copyHint}</span> : null}
      </div>
    </ToolShortcutArea>
  )
}
