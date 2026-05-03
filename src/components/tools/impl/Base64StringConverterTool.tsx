'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { base64ToText, isValidBase64, textToBase64 } from '@/lib/tools/logic/base64-convert'

const LS_ENCODE = 'base64-string-converter--encode-url-safe'
const LS_DECODE = 'base64-string-converter--decode-url-safe'

function loadBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback
  const v = window.localStorage.getItem(key)
  if (v === null) return fallback
  return v === '1' || v === 'true'
}

function saveBool(key: string, value: boolean) {
  window.localStorage.setItem(key, value ? '1' : '0')
}

export function Base64StringConverterTool() {
  const [encodeUrlSafe, setEncodeUrlSafe] = useState(false)
  const [decodeUrlSafe, setDecodeUrlSafe] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [hint, setHint] = useState('')
  const encodeOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const decodeOutRef = useRef<ToolCodeEditorHandle | null>(null)

  useEffect(() => {
    setEncodeUrlSafe(loadBool(LS_ENCODE, false))
    setDecodeUrlSafe(loadBool(LS_DECODE, false))
  }, [])

  const base64Output = useMemo(
    () => textToBase64(textInput, { makeUrlSafe: encodeUrlSafe }),
    [textInput, encodeUrlSafe],
  )

  const decodeValid = useMemo(
    () => isValidBase64(base64Input.trim(), { makeUrlSafe: decodeUrlSafe }),
    [base64Input, decodeUrlSafe],
  )

  const textOutput = useMemo(() => {
    try {
      return base64ToText(base64Input.trim(), { makeUrlSafe: decodeUrlSafe })
    } catch {
      return ''
    }
  }, [base64Input, decodeUrlSafe])

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={encodeOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">String → Base64</h2>
        <label className={`${toolLabelClass} flex items-center gap-2`}>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={encodeUrlSafe}
            onChange={(e) => {
              const v = e.target.checked
              setEncodeUrlSafe(v)
              saveBool(LS_ENCODE, v)
            }}
          />
          URL-safe 编码（无 padding，+ / 替换为 - _）
        </label>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            原始字符串
            <ToolCodeMirror value={textInput} onChange={setTextInput} rows={5} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            Base64
            <ToolCodeMirror ref={encodeOutRef} readOnly value={base64Output} rows={5} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(base64Output)
              setHint('Base64 已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            复制 Base64
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={decodeOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">Base64 → String</h2>
        <label className={`${toolLabelClass} flex items-center gap-2`}>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-orange-300 text-orange-600"
            checked={decodeUrlSafe}
            onChange={(e) => {
              const v = e.target.checked
              setDecodeUrlSafe(v)
              saveBool(LS_DECODE, v)
            }}
          />
          URL-safe 解码
        </label>
        <div className={toolConverterEditorGridClass}>
          {!decodeValid && base64Input.trim() !== '' ? (
            <p className="text-sm text-red-600 lg:col-span-2">无效的 Base64 字符串</p>
          ) : null}
          <label className={toolLabelClass}>
            Base64 字符串
            <ToolCodeMirror
              value={base64Input}
              onChange={setBase64Input}
              rows={5}
              language="plaintext"
              variant="in"
              className={decodeValid || base64Input.trim() === '' ? undefined : '!border-red-400 ring-1 ring-red-400'}
            />
          </label>
          <label className={toolLabelClass}>
            解码结果
            <ToolCodeMirror ref={decodeOutRef} readOnly value={textOutput} rows={5} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!decodeValid}
            onClick={async () => {
              await navigator.clipboard.writeText(textOutput)
              setHint('解码文本已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            复制解码文本
          </button>
        </div>
      </ToolShortcutArea>
      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}
    </div>
  )
}
