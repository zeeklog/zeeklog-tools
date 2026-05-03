'use client'

import { useMemo, useState } from 'react'
import {
  convertCelsiusToKelvin,
  convertDelisleToKelvin,
  convertFahrenheitToKelvin,
  convertKelvinToCelsius,
  convertKelvinToDelisle,
  convertKelvinToFahrenheit,
  convertKelvinToNewton,
  convertKelvinToRankine,
  convertKelvinToReaumur,
  convertKelvinToRomer,
  convertNewtonToKelvin,
  convertRankineToKelvin,
  convertReaumurToKelvin,
  convertRomerToKelvin,
} from '@/lib/tools/logic/temperature-scales'

type Scale = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine' | 'delisle' | 'newton' | 'reaumur' | 'romer'

const toK: Record<Scale, (v: number) => number> = {
  kelvin: (v) => v,
  celsius: convertCelsiusToKelvin,
  fahrenheit: convertFahrenheitToKelvin,
  rankine: convertRankineToKelvin,
  delisle: convertDelisleToKelvin,
  newton: convertNewtonToKelvin,
  reaumur: convertReaumurToKelvin,
  romer: convertRomerToKelvin,
}

const fromK: Record<Scale, (k: number) => number> = {
  kelvin: (k) => k,
  celsius: convertKelvinToCelsius,
  fahrenheit: convertKelvinToFahrenheit,
  rankine: convertKelvinToRankine,
  delisle: convertKelvinToDelisle,
  newton: convertKelvinToNewton,
  reaumur: convertKelvinToReaumur,
  romer: convertKelvinToRomer,
}

const labels: Record<Scale, string> = {
  kelvin: '开尔文 (K)',
  celsius: '摄氏 (°C)',
  fahrenheit: '华氏 (°F)',
  rankine: '兰氏 (°R)',
  delisle: '德利尔 (°De)',
  newton: '牛顿 (°N)',
  reaumur: '列氏 (°Ré)',
  romer: '罗氏 (°Rø)',
}

export function TemperatureConverterTool() {
  const [scale, setScale] = useState<Scale>('celsius')
  const [val, setVal] = useState('0')

  const kelvin = useMemo(() => {
    const n = Number(val)
    if (Number.isNaN(n)) return null
    return toK[scale](n)
  }, [scale, val])

  const all = useMemo(() => {
    if (kelvin === null) return null
    return (Object.keys(fromK) as Scale[]).map((s) => ({ scale: s, value: fromK[s](kelvin) }))
  }, [kelvin])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={scale} onChange={(e) => setScale(e.target.value as Scale)} className="rounded border px-2 py-1 text-sm">
          {(Object.keys(labels) as Scale[]).map((s) => (
            <option key={s} value={s}>
              {labels[s]}
            </option>
          ))}
        </select>
        <input value={val} onChange={(e) => setVal(e.target.value)} className="w-32 rounded border px-2 py-1 font-mono text-sm" />
      </div>
      {all === null && <p className="text-sm text-red-600">请输入数字</p>}
      {all && (
        <dl className="grid gap-2 sm:grid-cols-2">
          {all.map(({ scale: s, value }) => (
            <div key={s} className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm">
              <dt>{labels[s]}</dt>
              <dd className="font-mono">{value.toFixed(4)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
