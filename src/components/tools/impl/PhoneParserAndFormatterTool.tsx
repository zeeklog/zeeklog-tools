'use client'

import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function PhoneParserAndFormatterTool() {
  const [raw, setRaw] = useState('+1 213 373 4253')
  const [country, setCountry] = useState('US')
  const outRef = useRef<HTMLDivElement>(null)

  const parsed = useMemo(() => parsePhoneNumberFromString(raw, country as import('libphonenumber-js').CountryCode), [raw, country])

  const formatted = useMemo(() => {
    try {
      const a = new AsYouType(country as import('libphonenumber-js').CountryCode)
      return a.input(raw)
    } catch {
      return raw
    }
  }, [raw, country])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <label className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        默认国家/地区（ISO2）
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value.toUpperCase())}
          maxLength={2}
          className="w-16 rounded border px-2 py-1 font-mono uppercase"
        />
      </label>
      <ToolCodeMirror value={raw} onChange={setRaw} rows={3} language="plaintext" variant="in" />
      <p className="text-sm text-gray-600">输入格式化：{formatted}</p>
      <div
        ref={outRef}
        tabIndex={-1}
        className="outline-none focus:ring-2 focus:ring-orange-100"
      >
        {parsed?.isValid() ? (
          <dl className="space-y-1 rounded-lg bg-gray-50 p-4 font-mono text-xs">
            <div>国际格式：{parsed.formatInternational()}</div>
            <div>国内格式：{parsed.formatNational()}</div>
            <div>E.164：{parsed.format('E.164')}</div>
            <div>国家：{parsed.country}</div>
            <div>类型：{parsed.getType() ?? '—'}</div>
          </dl>
        ) : (
          <p className="text-sm text-amber-700">无法解析为有效号码（仍显示 AsYouType 输入过程）。</p>
        )}
      </div>
    </ToolShortcutArea>
  )
}
