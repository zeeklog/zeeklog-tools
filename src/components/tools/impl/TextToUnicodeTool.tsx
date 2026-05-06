'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { convertTextToUnicode, convertUnicodeToText } from '@/lib/tools/logic/text-unicode'

export function TextToUnicodeTool() {
  const locale = useToolLocale()
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
    setHint(locale === 'zh' ? '已复制' : 'Copied')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={textToUniOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">{locale === 'zh' ? '文本 → Unicode 实体' : 'Text → Unicode entities'}</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            {locale === 'zh' ? '文本' : 'Text'}
            <ToolCodeMirror
              value={inputText}
              onChange={setInputText}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder={locale === 'zh' ? '例如 Hello' : 'For example: Hello'}
            />
          </label>
          <label className={toolLabelClass}>
            {locale === 'zh' ? 'Unicode 实体' : 'Unicode entities'}
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
            {locale === 'zh' ? '复制 Unicode' : 'Copy Unicode'}
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={uniToTextOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">{locale === 'zh' ? 'Unicode 实体 → 文本' : 'Unicode entities → Text'}</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            {locale === 'zh' ? 'Unicode 实体' : 'Unicode entities'}
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
            {locale === 'zh' ? '文本' : 'Text'}
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
            {locale === 'zh' ? '复制文本' : 'Copy text'}
          </button>
        </div>
      </ToolShortcutArea>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </div>
  )
}
