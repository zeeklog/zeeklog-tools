'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

function safeEncode(s: string): { ok: true; out: string } | { ok: false } {
  try {
    encodeURIComponent(s)
    return { ok: true, out: encodeURIComponent(s) }
  } catch {
    return { ok: false }
  }
}

function safeDecode(s: string): { ok: true; out: string } | { ok: false } {
  try {
    decodeURIComponent(s)
    return { ok: true, out: decodeURIComponent(s) }
  } catch {
    return { ok: false }
  }
}

export function UrlEncoderTool() {
  const [encodeInput, setEncodeInput] = useState('Hello world :)')
  const [decodeInput, setDecodeInput] = useState('Hello%20world%20%3A)')
  const [hint, setHint] = useState('')
  const encodeOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const decodeOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const encoded = useMemo(() => safeEncode(encodeInput), [encodeInput])
  const decoded = useMemo(() => safeDecode(decodeInput), [decodeInput])

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={encodeOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-slate-900">Encode</h2>
        <div className={toolConverterEditorGridClass}>
          {!encoded.ok ? <p className="text-sm text-red-600 lg:col-span-2">无法对该字符串进行编码</p> : null}
          <label className="block text-sm font-medium text-slate-800">
            原始字符串
            <ToolCodeMirror value={encodeInput} onChange={setEncodeInput} rows={2} language="plaintext" variant="in" />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            编码结果
            <ToolCodeMirror
              ref={encodeOutRef}
              readOnly
              value={encoded.ok ? encoded.out : ''}
              rows={2}
              language="plaintext"
              variant="out"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!encoded.ok}
            onClick={async () => {
              if (!encoded.ok) return
              await navigator.clipboard.writeText(encoded.out)
              setHint('编码结果已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={decodeOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-slate-900">Decode</h2>
        <div className={toolConverterEditorGridClass}>
          {!decoded.ok ? <p className="text-sm text-red-600 lg:col-span-2">无法解析该字符串</p> : null}
          <label className="block text-sm font-medium text-slate-800">
            已编码字符串
            <ToolCodeMirror value={decodeInput} onChange={setDecodeInput} rows={2} language="plaintext" variant="in" />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            解码结果
            <ToolCodeMirror
              ref={decodeOutRef}
              readOnly
              value={decoded.ok ? decoded.out : ''}
              rows={2}
              language="plaintext"
              variant="out"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!decoded.ok}
            onClick={async () => {
              if (!decoded.ok) return
              await navigator.clipboard.writeText(decoded.out)
              setHint('解码结果已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-emerald-700">{hint}</p> : null}
    </div>
  )
}
