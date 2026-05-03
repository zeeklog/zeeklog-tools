'use client'

import { formatISO, fromUnixTime, getUnixTime, getTime, isValid, parseISO } from 'date-fns'
import { useMemo, useState } from 'react'

function tryParse(input: string): Date | null {
  const t = input.trim()
  if (!t) return null
  if (/^\d{13}$/.test(t)) {
    const d = new Date(Number(t))
    return isValid(d) ? d : null
  }
  if (/^\d{10}$/.test(t)) {
    const d = fromUnixTime(Number(t))
    return isValid(d) ? d : null
  }
  const d = parseISO(t)
  return isValid(d) ? d : null
}

export function DateConverterTool() {
  const [raw, setRaw] = useState(new Date().toISOString())

  const d = useMemo(() => tryParse(raw), [raw])

  const rows = useMemo(() => {
    if (!d) return []
    return [
      ['ISO 8601', formatISO(d)],
      ['Unix 秒', String(getUnixTime(d))],
      ['Unix 毫秒', String(getTime(d))],
      ['UTC 字符串', d.toUTCString()],
      ['本地字符串', d.toString()],
    ] as const
  }, [d])

  return (
    <div className="space-y-4">
      <input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="ISO 时间、Unix 秒/毫秒等"
        className="w-full rounded-lg border px-3 py-2 font-mono text-sm"
      />
      {!d && raw.trim() !== '' && <p className="text-sm text-red-600">无法解析为日期</p>}
      <dl className="space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap gap-2 text-sm">
            <dt className="w-32 shrink-0 text-gray-600">{k}</dt>
            <dd className="min-w-0 flex-1 font-mono text-xs break-all">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
