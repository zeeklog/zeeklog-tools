'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { escapeHtmlEntities, unescapeHtmlEntities } from '@/lib/tools/logic/html-entity'

export function HtmlEntitiesTool() {
  const [escapeInput, setEscapeInput] = useState('<title>IT Tool</title>')
  const [unescapeInput, setUnescapeInput] = useState('&lt;title&gt;IT Tool&lt;/title&gt;')
  const [hint, setHint] = useState('')
  const escapeOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const unescapeOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const escaped = useMemo(() => escapeHtmlEntities(escapeInput), [escapeInput])
  const unescaped = useMemo(() => unescapeHtmlEntities(unescapeInput), [unescapeInput])

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={escapeOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">Escape HTML entities</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            原始字符串
            <ToolCodeMirror value={escapeInput} onChange={setEscapeInput} rows={3} language="html" variant="in" />
          </label>
          <label className={toolLabelClass}>
            转义后
            <ToolCodeMirror ref={escapeOutRef} readOnly value={escaped} rows={3} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(escaped)
              setHint('已复制转义结果')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            复制
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={unescapeOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">Unescape HTML entities</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            已转义字符串
            <ToolCodeMirror value={unescapeInput} onChange={setUnescapeInput} rows={3} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            反转义后
            <ToolCodeMirror ref={unescapeOutRef} readOnly value={unescaped} rows={3} language="html" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(unescaped)
              setHint('已复制反转义结果')
              window.setTimeout(() => setHint(''), 2000)
            }}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            复制
          </button>
        </div>
      </ToolShortcutArea>
      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}
    </div>
  )
}
