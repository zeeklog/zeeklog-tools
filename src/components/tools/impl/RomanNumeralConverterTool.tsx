'use client'

import { useMemo, useState } from 'react'
import {
  MAX_ARABIC_TO_ROMAN,
  MIN_ARABIC_TO_ROMAN,
  arabicToRoman,
  isValidRomanNumber,
  romanToArabic,
} from '@/lib/tools/logic/roman-numeral'

export function RomanNumeralConverterTool() {
  const [arabic, setArabic] = useState(42)
  const [romanIn, setRomanIn] = useState('XLII')
  const [hint, setHint] = useState('')

  const arabicValid = arabic >= MIN_ARABIC_TO_ROMAN && arabic <= MAX_ARABIC_TO_ROMAN
  const outputRoman = useMemo(() => (arabicValid ? arabicToRoman(arabic) : ''), [arabic, arabicValid])
  const romanValid = isValidRomanNumber(romanIn)
  const outputArabic = useMemo(() => (romanValid ? romanToArabic(romanIn) : null), [romanIn, romanValid])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-xl border border-gray-100 p-4">
        <h2 className="text-base font-semibold text-gray-900">阿拉伯数字 → 罗马数字</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="number"
            value={Number.isNaN(arabic) ? '' : arabic}
            onChange={(e) => setArabic(Number(e.target.value))}
            className="w-40 rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
          <span className="text-2xl font-medium text-gray-900">{outputRoman || '—'}</span>
          <button
            type="button"
            disabled={!arabicValid || !outputRoman}
            onClick={() => copy(outputRoman)}
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            复制
          </button>
        </div>
        {!arabicValid && (
          <p className="text-sm text-red-600">
            仅支持 {MIN_ARABIC_TO_ROMAN.toLocaleString()}–{MAX_ARABIC_TO_ROMAN.toLocaleString()}。
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-gray-100 p-4">
        <h2 className="text-base font-semibold text-gray-900">罗马数字 → 阿拉伯数字</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            value={romanIn}
            onChange={(e) => setRomanIn(e.target.value.toUpperCase())}
            className="w-40 rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm uppercase"
          />
          <span className="text-2xl font-medium text-gray-900">{outputArabic ?? '—'}</span>
          <button
            type="button"
            disabled={outputArabic === null}
            onClick={() => outputArabic !== null && copy(String(outputArabic))}
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            复制
          </button>
        </div>
        {!romanValid && romanIn.trim() !== '' && <p className="text-sm text-red-600">不是有效的罗马数字。</p>}
      </section>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </div>
  )
}
