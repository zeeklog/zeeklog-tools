'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  base32ToText,
  base58ToText,
  jsonStringForUrlQuery,
  textToBase32,
  textToBase58,
  urlQueryToJsonString,
} from '@/lib/tools/logic/encoding-extra'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Mode = 'b32-enc' | 'b32-dec' | 'b58-enc' | 'b58-dec' | 'json-url-enc' | 'json-url-dec'

export function EncodingToolkitTool() {
  const [mode, setMode] = useState<Mode>('b32-enc')
  const [raw, setRaw] = useState('hello')
  const limitMsg = assertInputWithinLimit(raw)

  const langForMode = mode === 'json-url-enc' || mode === 'json-url-dec' ? 'json' : 'plaintext'

  const { out, err } = useMemo(() => {
    if (limitMsg) return { out: '', err: '' as string }
    try {
      switch (mode) {
        case 'b32-enc':
          return { out: textToBase32(raw), err: '' }
        case 'b32-dec':
          return { out: base32ToText(raw), err: '' }
        case 'b58-enc':
          return { out: textToBase58(raw), err: '' }
        case 'b58-dec':
          return { out: base58ToText(raw), err: '' }
        case 'json-url-enc':
          return { out: jsonStringForUrlQuery(raw), err: '' }
        case 'json-url-dec':
          return { out: urlQueryToJsonString(raw), err: '' }
        default:
          return { out: '', err: '' }
      }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [raw, mode, limitMsg])

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Base64 见{' '}
        <Link href="/tools/base64-string-converter" className="text-orange-700 underline">
          Base64 字符串
        </Link>
        ；URL 百分号编码见 <Link href="/tools/url-encoder" className="text-orange-700 underline">URL 编码</Link>。
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        {(
          [
            ['b32-enc', 'Base32 编码'],
            ['b32-dec', 'Base32 解码'],
            ['b58-enc', 'Base58 编码'],
            ['b58-dec', 'Base58 解码'],
            ['json-url-enc', 'JSON → URL 编码'],
            ['json-url-dec', 'URL 解码 → JSON'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-lg border px-3 py-1.5 ${mode === k ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white'}`}
          >
            {l}
          </button>
        ))}
      </div>
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            输入
            <ToolCodeMirror value={raw} onChange={setRaw} rows={6} language={langForMode} variant="in" />
          </label>
          <label className={toolLabelClass}>
            输出
            <ToolCodeMirror readOnly value={out} rows={6} language={langForMode} variant="out" />
          </label>
        </div>
      </div>
    </div>
  )
}
