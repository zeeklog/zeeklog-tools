'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { textToUtf8HexBytes, textToUtf8PercentEncoded, utf8HexOrPercentToText } from '@/lib/tools/logic/utf8-inspector'

export function Utf8InspectorTool() {
  const [text, setText] = useState('你好 UTF-8')
  const [decodeInput, setDecodeInput] = useState('e4 bd a0 e5 a5 bd')
  const hexOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const decodeTextOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const hex = useMemo(() => textToUtf8HexBytes(text), [text])
  const pct = useMemo(() => textToUtf8PercentEncoded(text), [text])

  const decoded = useMemo(() => utf8HexOrPercentToText(decodeInput), [decodeInput])

  return (
    <div className="space-y-6">
      <ToolShortcutArea focusRef={hexOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">文本 → UTF-8 视图</h3>
        <div className={toolConverterEditorGridClass}>
          <div className="flex min-h-0 min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-800">文本</span>
            <ToolCodeMirror value={text} onChange={setText} rows={4} language="plaintext" variant="in" />
          </div>
          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-500">十六进制字节（空格分隔）</p>
              <ToolCodeMirror
                ref={hexOutRef}
                readOnly
                value={hex}
                rows={2}
                language="plaintext"
                variant="out"
                className="text-xs [&_.cm-content]:text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-500">按字节的百分号编码（非 RFC3986 整段 URI，仅展示 UTF-8 字节）</p>
              <ToolCodeMirror
                readOnly
                value={pct}
                rows={2}
                language="plaintext"
                variant="out"
                className="break-all text-xs [&_.cm-content]:text-xs"
              />
            </div>
          </div>
        </div>
      </ToolShortcutArea>
      <ToolShortcutArea focusRef={decodeTextOutRef} className={toolSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">UTF-8 十六进制或 %XX → 文本</h3>
        <div className={toolConverterEditorGridClass}>
          {!decoded.ok && decodeInput.trim() !== '' ? (
            <p className="text-sm text-red-600 lg:col-span-2">{decoded.error}</p>
          ) : null}
          <label className="flex min-h-0 min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-800">
            输入
            <ToolCodeMirror
              value={decodeInput}
              onChange={setDecodeInput}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder="如 e4bda0e5a5bd 或 %E4%BD%A0%E5%A5%BD"
            />
          </label>
          <label className="flex min-h-0 min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-800">
            解码文本
            <ToolCodeMirror
              ref={decodeTextOutRef}
              readOnly
              value={decoded.ok ? decoded.text : ''}
              rows={4}
              language="plaintext"
              variant="out"
            />
          </label>
        </div>
      </ToolShortcutArea>
    </div>
  )
}
