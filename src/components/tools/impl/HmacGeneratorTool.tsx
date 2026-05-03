'use client'

import type { lib } from 'crypto-js'
import {
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  enc,
} from 'crypto-js'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import {
  toolConverterEditorGridClass,
  toolInputClass,
  toolLabelClass,
  toolSectionClass,
} from '@/components/tools/tool-field-classes'
import { convertHexToBin } from '@/lib/tools/logic/hash-format'

const algos = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
} as const

type Encoding = keyof typeof enc | 'Bin'

function formatWithEncoding(words: lib.WordArray, encoding: Encoding): string {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex))
  }
  return words.toString(enc[encoding])
}

export function HmacGeneratorTool() {
  const [plain, setPlain] = useState('')
  const [secret, setSecret] = useState('')
  const [fn, setFn] = useState<keyof typeof algos>('SHA256')
  const [encoding, setEncoding] = useState<Encoding>('Hex')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const hmac = useMemo(
    () => formatWithEncoding(algos[fn](plain, secret), encoding),
    [plain, secret, fn, encoding],
  )

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          明文
          <ToolCodeMirror value={plain} onChange={setPlain} rows={3} language="plaintext" variant="in" />
        </label>
        <div className="flex min-h-0 min-w-0 flex-col gap-4">
          <label className={toolLabelClass}>
            密钥
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className={toolInputClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={toolLabelClass}>
              算法
              <select
                value={fn}
                onChange={(e) => setFn(e.target.value as keyof typeof algos)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {Object.keys(algos).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label className={toolLabelClass}>
              输出编码
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value as Encoding)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="Bin">Binary</option>
                <option value="Hex">Hex</option>
                <option value="Base64">Base64</option>
                <option value="Base64url">Base64url</option>
              </select>
            </label>
          </div>
          <label className={toolLabelClass}>
            HMAC
            <ToolCodeMirror ref={outRef} readOnly value={hmac} rows={2} language="plaintext" variant="out" />
          </label>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(hmac)}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white"
        >
          复制 HMAC
        </button>
      </div>
    </ToolShortcutArea>
  )
}
