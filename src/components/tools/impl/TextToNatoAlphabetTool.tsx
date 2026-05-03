'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { textToNatoAlphabet } from '@/lib/tools/logic/nato-alphabet'

export function TextToNatoAlphabetTool() {
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const nato = useMemo(() => textToNatoAlphabet(text), [text])

  const copy = async () => {
    if (!nato) return
    await navigator.clipboard.writeText(nato)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          文本
          <ToolCodeMirror value={text} onChange={setText} rows={4} language="plaintext" variant="in" />
        </label>
        <label className={toolLabelClass}>
          NATO 字母拼读
          <ToolCodeMirror ref={outRef} readOnly value={nato} rows={4} language="plaintext" variant="out" />
        </label>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          disabled={!nato}
          onClick={copy}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          复制
        </button>
      </div>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </ToolShortcutArea>
  )
}
