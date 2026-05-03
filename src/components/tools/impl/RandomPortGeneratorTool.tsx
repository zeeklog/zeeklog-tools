'use client'

import { useCallback, useMemo, useState } from 'react'
import { generatePort } from '@/lib/tools/logic/random-port'

export function RandomPortGeneratorTool() {
  const [tick, setTick] = useState(0)
  const port = useMemo(() => String(generatePort()), [tick])
  const [hint, setHint] = useState('')

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(port)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }, [port])

  return (
    <div className="space-y-6 text-center">
      <div className="py-2 text-[26px] font-normal text-gray-900">{port}</div>
      <div className="flex flex-wrap justify-center gap-3">
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
        {hint ? <span className="self-center text-sm text-green-700">{hint}</span> : null}
      </div>
      <p className="text-xs text-gray-500">与 online-tool-box 相同：`randIntFromInterval(1024, 65535)`</p>
    </div>
  )
}
