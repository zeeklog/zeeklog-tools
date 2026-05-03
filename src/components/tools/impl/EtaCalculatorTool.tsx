'use client'

import { addMilliseconds, formatRelative } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { formatMsDuration } from '@/lib/tools/logic/eta-duration'

export function EtaCalculatorTool() {
  const [unitCount, setUnitCount] = useState(3 * 62)
  const [perSpan, setPerSpan] = useState(3)
  const [span, setSpan] = useState(5)
  const [spanMul, setSpanMul] = useState(60_000)
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString().slice(0, 16))

  const { durationMs, endRel } = useMemo(() => {
    const spanMs = span * spanMul
    const rate = perSpan / spanMs
    const durationMs = unitCount / rate
    const start = new Date(startedAt)
    const end = addMilliseconds(start, durationMs)
    return {
      durationMs,
      endRel: formatRelative(end, new Date(), { locale: zhCN }),
    }
  }, [unitCount, perSpan, span, spanMul, startedAt])

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-600">例如：每 3 分钟洗 5 个盘子，共 186 个盘子，可估算总耗时与大致结束时间。</p>
      <label className="block">
        总任务量
        <input type="number" min={1} value={unitCount} onChange={(e) => setUnitCount(Number(e.target.value))} className="ml-2 w-32 rounded border px-2 py-1" />
      </label>
      <label className="block">
        开始时间
        <input type="datetime-local" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} className="ml-2 rounded border px-2 py-1" />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <span>每</span>
        <input type="number" min={1} value={perSpan} onChange={(e) => setPerSpan(Number(e.target.value))} className="w-20 rounded border px-2 py-1" />
        <span>个任务，耗时</span>
        <input type="number" min={1} value={span} onChange={(e) => setSpan(Number(e.target.value))} className="w-20 rounded border px-2 py-1" />
        <select value={spanMul} onChange={(e) => setSpanMul(Number(e.target.value))} className="rounded border px-2 py-1">
          <option value={1}>毫秒</option>
          <option value={1000}>秒</option>
          <option value={60_000}>分钟</option>
          <option value={3_600_000}>小时</option>
          <option value={86_400_000}>天</option>
        </select>
      </div>
      <div className="rounded-xl border p-4">
        <p className="text-gray-600">总时长</p>
        <p className="text-lg font-semibold">{formatMsDuration(durationMs)}</p>
      </div>
      <div className="rounded-xl border p-4">
        <p className="text-gray-600">相对结束描述</p>
        <p className="text-lg font-semibold">{endRel}</p>
      </div>
    </div>
  )
}
