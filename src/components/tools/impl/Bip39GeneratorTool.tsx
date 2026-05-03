'use client'

import {
  englishWordList,
  entropyToMnemonic,
  generateEntropy,
  mnemonicToEntropy,
} from '@it-tools/bip39'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function Bip39GeneratorTool() {
  const [entropy, setEntropy] = useState(() => generateEntropy())
  const [mnemonicManual, setMnemonicManual] = useState('')
  const passphraseRef = useRef<ToolCodeEditorHandle | null>(null)

  const passphrase = useMemo(() => {
    if (mnemonicManual.trim()) return mnemonicManual
    try {
      return entropyToMnemonic(entropy, englishWordList)
    } catch {
      return ''
    }
  }, [entropy, mnemonicManual])

  const refresh = useCallback(() => {
    setMnemonicManual('')
    setEntropy(generateEntropy())
  }, [])

  const applyMnemonic = (v: string) => {
    setMnemonicManual(v)
    try {
      setEntropy(mnemonicToEntropy(v.trim(), englishWordList))
    } catch {
      /* keep entropy */
    }
  }

  return (
    <ToolShortcutArea focusRef={passphraseRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        熵（十六进制，长度 16–32 且为 4 的倍数）
        <input
          value={entropy}
          onChange={(e) => {
            setMnemonicManual('')
            setEntropy(e.target.value)
          }}
          className={toolInputClass}
        />
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={refresh} className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm text-white">
          重新生成熵
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(entropy)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          复制熵
        </button>
      </div>
      <label className={toolLabelClass}>
        助记词（可编辑；与熵互转）
        <ToolCodeMirror
          ref={passphraseRef}
          value={passphrase}
          onChange={applyMnemonic}
          rows={3}
          language="plaintext"
          variant="in"
        />
      </label>
      <button
        type="button"
        onClick={() => void navigator.clipboard.writeText(passphrase)}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
      >
        复制助记词
      </button>
    </ToolShortcutArea>
  )
}
