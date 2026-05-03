'use client'

import { useCallback, useMemo, useState } from 'react'
import { ulid } from 'ulid'

type Format = 'raw' | 'json'

export function UlidGeneratorTool() {
  const [amount, setAmount] = useState(1)
  const [format, setFormat] = useState<Format>('raw')
  const [tick, setTick] = useState(0)
  const [copyHint, setCopyHint] = useState('')

  const output = useMemo(() => {
    const ids = Array.from({ length: amount }, () => ulid())
    if (format === 'json') {
      return JSON.stringify(ids, null, 2)
    }
    return ids.join('\n')
  }, [amount, format, tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(output)
    setCopyHint('已复制')
    window.setTimeout(() => setCopyHint(''), 2000)
  }, [output])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span className="w-16 shrink-0">数量</span>
          <input
            type="number"
            min={1}
            max={100}
            value={amount}
            onChange={(e) => setAmount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            className="w-24 rounded-md border border-gray-200 px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>格式</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm"
          >
            <option value="raw">Raw</option>
            <option value="json">JSON</option>
          </select>
        </label>
      </div>

      <pre className="max-h-80 overflow-auto rounded-lg border border-gray-100 bg-gray-50 p-4 font-mono text-sm text-gray-900">
        {output}
      </pre>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          刷新
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          复制
        </button>
        {copyHint ? <span className="text-sm text-green-700">{copyHint}</span> : null}
      </div>
    </div>
  )
}
