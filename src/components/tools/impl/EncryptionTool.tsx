'use client'

import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import {
  toolConverterEditorGridClass,
  toolInputClass,
  toolLabelClass,
  toolSectionClass,
} from '@/components/tools/tool-field-classes'

const algos = { AES, TripleDES, Rabbit, RC4 } as const

export function EncryptionTool() {
  const [plain, setPlain] = useState('Lorem ipsum dolor sit amet')
  const [encAlgo, setEncAlgo] = useState<keyof typeof algos>('AES')
  const [secretEnc, setSecretEnc] = useState('my secret key')

  const [cipherIn, setCipherIn] = useState(
    'U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs',
  )
  const [decAlgo, setDecAlgo] = useState<keyof typeof algos>('AES')
  const [secretDec, setSecretDec] = useState('my secret key')

  const encOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const decOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const encrypted = useMemo(
    () => algos[encAlgo].encrypt(plain, secretEnc).toString(),
    [plain, encAlgo, secretEnc],
  )

  const { decrypted, decError } = useMemo(() => {
    try {
      return { decrypted: algos[decAlgo].decrypt(cipherIn, secretDec).toString(enc.Utf8), decError: '' }
    } catch {
      return { decrypted: '', decError: '无法解密，请检查密文与密钥、算法是否匹配。' }
    }
  }, [cipherIn, decAlgo, secretDec])

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={encOutRef} showShortcutHint={false} className={`${toolSectionClass} rounded-xl border border-gray-100 p-4`}>
        <h2 className="font-semibold text-gray-900">加密</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={secretEnc}
            onChange={(e) => setSecretEnc(e.target.value)}
            placeholder="密钥"
            className={toolInputClass}
          />
          <select
            value={encAlgo}
            onChange={(e) => setEncAlgo(e.target.value as keyof typeof algos)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {Object.keys(algos).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            明文
            <ToolCodeMirror value={plain} onChange={setPlain} rows={5} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            密文
            <ToolCodeMirror ref={encOutRef} readOnly value={encrypted} rows={5} language="plaintext" variant="out" />
          </label>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={decOutRef} className={`${toolSectionClass} rounded-xl border border-gray-100 p-4`}>
        <h2 className="font-semibold text-gray-900">解密</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={secretDec}
            onChange={(e) => setSecretDec(e.target.value)}
            placeholder="密钥"
            className={toolInputClass}
          />
          <select
            value={decAlgo}
            onChange={(e) => setDecAlgo(e.target.value as keyof typeof algos)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {Object.keys(algos).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className={toolConverterEditorGridClass}>
          {decError ? <p className="text-sm text-red-600 lg:col-span-2">{decError}</p> : null}
          <label className={toolLabelClass}>
            密文
            <ToolCodeMirror value={cipherIn} onChange={setCipherIn} rows={5} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            明文
            <ToolCodeMirror ref={decOutRef} readOnly value={decError ? '' : decrypted} rows={5} language="plaintext" variant="out" />
          </label>
        </div>
      </ToolShortcutArea>
    </div>
  )
}
