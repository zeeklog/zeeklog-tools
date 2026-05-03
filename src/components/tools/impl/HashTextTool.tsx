'use client'

import type { lib } from 'crypto-js'
import { MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512, enc } from 'crypto-js'
import { crc32 } from 'crc'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolInputReadonlyClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { convertHexToBin } from '@/lib/tools/logic/hash-format'

const algos = { MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3, RIPEMD160 } as const
type AlgoNames = keyof typeof algos
type Encoding = keyof typeof enc | 'Bin'

const algoNames = Object.keys(algos) as AlgoNames[]

function formatWithEncoding(words: lib.WordArray, encoding: Encoding): string {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex))
  }
  return words.toString(enc[encoding])
}

export function HashTextTool() {
  const [text, setText] = useState('')
  const [encoding, setEncoding] = useState<Encoding>('Hex')
  const firstOutRef = useRef<HTMLInputElement>(null)

  const rows = useMemo(() => {
    return algoNames.map((algo) => ({
      algo,
      out: formatWithEncoding(algos[algo](text), encoding),
    }))
  }, [text, encoding])

  const crc32Out = useMemo(() => {
    const u = crc32(text) >>> 0
    const hex = u.toString(16).padStart(8, '0')
    if (encoding === 'Bin') {
      return convertHexToBin(hex)
    }
    if (encoding === 'Hex') {
      return hex
    }
    const words = enc.Hex.parse(hex)
    return words.toString(enc[encoding])
  }, [text, encoding])

  return (
    <ToolShortcutArea focusRef={firstOutRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        待哈希文本
        <ToolCodeMirror value={text} onChange={setText} rows={3} language="plaintext" variant="in" />
      </label>
      <label className={toolLabelClass}>
        输出编码
        <select
          value={encoding}
          onChange={(e) => setEncoding(e.target.value as Encoding)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        >
          <option value="Bin">Binary</option>
          <option value="Hex">Hex</option>
          <option value="Base64">Base64</option>
          <option value="Base64url">Base64url</option>
        </select>
      </label>
      <div className="space-y-2">
        {rows.map(({ algo, out }, i) => (
          <div key={algo} className="flex flex-wrap items-center gap-2">
            <span className="w-28 shrink-0 font-mono text-sm font-semibold text-slate-700">{algo}</span>
            <input
              ref={i === 0 ? firstOutRef : undefined}
              readOnly
              value={out}
              className={`min-w-0 flex-1 ${toolInputReadonlyClass}`}
            />
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(out)}
              className="shrink-0 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100"
            >
              复制
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
          <span className="w-28 shrink-0 font-mono text-sm font-semibold text-slate-700">CRC32</span>
          <input readOnly value={crc32Out} className={`min-w-0 flex-1 ${toolInputReadonlyClass}`} />
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(crc32Out)}
            className="shrink-0 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100"
          >
            复制
          </button>
        </div>
      </div>
    </ToolShortcutArea>
  )
}
