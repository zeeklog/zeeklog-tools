'use client'

import { useEffect, useRef, useState } from 'react'

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m % 60)}:${pad(s % 60)}.${String(Math.floor((ms % 1000) / 10)).padStart(2, '0')}`
}

export function ChronometerTool() {
  const [running, setRunning] = useState(false)
  const [display, setDisplay] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const accumulated = useRef(0)
  const startedAt = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setDisplay(accumulated.current + (Date.now() - startedAt.current))
    }, 50)
    return () => window.clearInterval(id)
  }, [running])

  const start = () => {
    startedAt.current = Date.now()
    setRunning(true)
  }

  const pause = () => {
    accumulated.current += Date.now() - startedAt.current
    setDisplay(accumulated.current)
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    accumulated.current = 0
    startedAt.current = 0
    setDisplay(0)
    setLaps([])
  }

  const lap = () => {
    const t = running ? accumulated.current + (Date.now() - startedAt.current) : display
    setLaps((l) => [...l, t])
  }

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="font-mono text-5xl font-bold tabular-nums text-gray-900">{fmt(display)}</div>
      <div className="flex flex-wrap justify-center gap-2">
        {!running ? (
          <button type="button" onClick={start} className="rounded-lg bg-orange-500 px-4 py-2 text-white">
            开始
          </button>
        ) : (
          <button type="button" onClick={pause} className="rounded-lg bg-gray-700 px-4 py-2 text-white">
            暂停
          </button>
        )}
        <button type="button" onClick={lap} className="rounded-lg border px-4 py-2">
          计次
        </button>
        <button type="button" onClick={reset} className="rounded-lg border px-4 py-2">
          重置
        </button>
      </div>
      {laps.length > 0 && (
        <ol className="max-h-48 overflow-auto text-left font-mono text-sm">
          {laps.map((t, i) => (
            <li key={i}>
              计次 {i + 1}: {fmt(t)}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
