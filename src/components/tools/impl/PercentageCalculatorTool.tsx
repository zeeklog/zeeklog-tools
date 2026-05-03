'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

function numOrUndef(v: string): number | undefined {
  if (v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export function PercentageCalculatorTool() {
  const [px, setPx] = useState('')
  const [py, setPy] = useState('')
  const [nx, setNx] = useState('')
  const [ny, setNy] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const percentageResult = useMemo(() => {
    const x = numOrUndef(px)
    const y = numOrUndef(py)
    if (x === undefined || y === undefined) return ''
    return String((x / 100) * y)
  }, [px, py])

  const numberResult = useMemo(() => {
    const x = numOrUndef(nx)
    const y = numOrUndef(ny)
    if (x === undefined || y === undefined || y === 0) return ''
    const result = (100 * x) / y
    return !Number.isFinite(result) || Number.isNaN(result) ? '' : String(result)
  }, [nx, ny])

  const incDec = useMemo(() => {
    const a = numOrUndef(from)
    const b = numOrUndef(to)
    if (a === undefined || b === undefined || a === 0) return ''
    const result = ((b - a) / a) * 100
    return !Number.isFinite(result) || Number.isNaN(result) ? '' : String(result)
  }, [from, to])

  const row = (label: string, children: ReactNode) => (
    <div className="rounded-xl border border-gray-100 p-4">
      <p className="mb-3 text-sm text-gray-600">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {row(
        'X% of Y 是多少',
        <>
          <input
            value={px}
            onChange={(e) => setPx(e.target.value)}
            placeholder="X"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <span className="text-sm">% of</span>
          <input
            value={py}
            onChange={(e) => setPy(e.target.value)}
            placeholder="Y"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <input
            readOnly
            value={percentageResult}
            placeholder="结果"
            className="min-w-[120px] flex-1 rounded-lg bg-gray-50 px-2 py-1 font-mono text-sm"
          />
        </>,
      )}
      {row(
        'X 是 Y 的百分之几',
        <>
          <input
            value={nx}
            onChange={(e) => setNx(e.target.value)}
            placeholder="X"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <span className="hidden text-sm sm:inline">占</span>
          <input
            value={ny}
            onChange={(e) => setNy(e.target.value)}
            placeholder="Y"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <span className="text-sm">的 %</span>
          <input
            readOnly
            value={numberResult}
            placeholder="结果"
            className="min-w-[120px] flex-1 rounded-lg bg-gray-50 px-2 py-1 font-mono text-sm"
          />
        </>,
      )}
      {row(
        '从 A 到 B 的增减百分比',
        <>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="w-24 rounded-lg border border-gray-200 px-2 py-1 font-mono text-sm"
          />
          <input
            readOnly
            value={incDec}
            placeholder="结果 %"
            className="min-w-[120px] flex-1 rounded-lg bg-gray-50 px-2 py-1 font-mono text-sm"
          />
        </>,
      )}
    </div>
  )
}
