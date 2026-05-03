'use client'

import * as IBAN from 'ibantools'
import { useMemo, useState } from 'react'

export function IbanValidatorAndParserTool() {
  const [raw, setRaw] = useState('GB82 WEST 1234 5698 7654 32')

  const result = useMemo(() => {
    const iban = raw.replace(/\s/g, '')
    if (!iban) return null
    const valid = IBAN.isValidIBAN(iban)
    const extracted = IBAN.extractIBAN(iban)
    return { valid, extracted, electronic: IBAN.electronicFormatIBAN(iban), friendly: IBAN.friendlyFormatIBAN(iban) }
  }, [raw])

  return (
    <div className="space-y-4">
      <input value={raw} onChange={(e) => setRaw(e.target.value)} className="w-full rounded-lg border px-3 py-2 font-mono text-sm" />
      {!result && <p className="text-sm text-gray-500">输入 IBAN</p>}
      {result && (
        <div className="space-y-2 rounded-xl border p-4 text-sm">
          <p className={result.valid ? 'font-medium text-green-700' : 'font-medium text-red-600'}>
            {result.valid ? '校验通过' : '校验未通过'}
          </p>
          {result.friendly && <p>友好格式：{result.friendly}</p>}
          {result.electronic && <p>电子格式：{result.electronic}</p>}
          {result.extracted?.valid && (
            <pre className="mt-2 overflow-auto rounded bg-gray-50 p-2 font-mono text-xs">
              {JSON.stringify(result.extracted, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
