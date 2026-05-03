'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { convertTextToUnicode, convertUnicodeToText } from '@/lib/tools/logic/text-unicode'

export function TextToUnicodeTool() {
  const [inputText, setInputText] = useState('')
  const [inputUnicode, setInputUnicode] = useState('')
  const [hint, setHint] = useState('')
  const textToUniOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const uniToTextOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const unicodeFromText = useMemo(
    () => (inputText.trim() === '' ? '' : convertTextToUnicode(inputText)),
    [inputText],
  )
  const textFromUnicode = useMemo(
    () => (inputUnicode.trim() === '' ? '' : convertUnicodeToText(inputUnicode)),
    [inputUnicode],
  )

  const copy = async (text: string) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={textToUniOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">文本 → Unicode 实体</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            文本
            <ToolCodeMirror
              value={inputText}
              onChange={setInputText}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder="例如 Hello"
            />
          </label>
          <label className={toolLabelClass}>
            Unicode 实体
            <ToolCodeMirror
              ref={textToUniOutRef}
              readOnly
              value={unicodeFromText}
              rows={4}
              language="plaintext"
              variant="out"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!unicodeFromText}
            onClick={() => copy(unicodeFromText)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            复制 Unicode
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={uniToTextOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">Unicode 实体 → 文本</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            Unicode 实体
            <ToolCodeMirror
              value={inputUnicode}
              onChange={setInputUnicode}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder="&#72;&#101;…"
            />
          </label>
          <label className={toolLabelClass}>
            文本
            <ToolCodeMirror ref={uniToTextOutRef} readOnly value={textFromUnicode} rows={4} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!textFromUnicode}
            onClick={() => copy(textFromUnicode)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            复制文本
          </button>
        </div>
      </ToolShortcutArea>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </div>
  )
}
