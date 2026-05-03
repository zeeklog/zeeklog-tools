'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { convertAsciiBinaryToText, convertTextToAsciiBinary } from '@/lib/tools/logic/text-binary'

export function TextToBinaryTool() {
  const [inputText, setInputText] = useState('')
  const [inputBinary, setInputBinary] = useState('')
  const [copyHint, setCopyHint] = useState('')
  const textToBinOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const binToTextOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const binaryFromText = useMemo(() => convertTextToAsciiBinary(inputText), [inputText])

  const binaryValid = useMemo(() => {
    try {
      convertAsciiBinaryToText(inputBinary)
      return true
    } catch {
      return false
    }
  }, [inputBinary])

  const textFromBinary = useMemo(() => {
    try {
      return convertAsciiBinaryToText(inputBinary)
    } catch {
      return ''
    }
  }, [inputBinary])

  const copy = async (t: string) => {
    if (!t) return
    await navigator.clipboard.writeText(t)
    setCopyHint('已复制')
    window.setTimeout(() => setCopyHint(''), 2000)
  }

  return (
    <div className="space-y-10">
      <ToolShortcutArea focusRef={textToBinOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">文本 → ASCII 二进制</h2>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            输入文本
            <ToolCodeMirror
              value={inputText}
              onChange={setInputText}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder="例如 Hello world"
            />
          </label>
          <label className={toolLabelClass}>
            二进制输出
            <ToolCodeMirror ref={textToBinOutRef} readOnly value={binaryFromText} rows={4} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!binaryFromText}
            onClick={() => copy(binaryFromText)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            复制二进制
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={binToTextOutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">ASCII 二进制 → 文本</h2>
        <div className={toolConverterEditorGridClass}>
          {!binaryValid && inputBinary.trim() !== '' && (
            <p className="text-sm text-red-600 lg:col-span-2">二进制须为有效 ASCII，且总位数为 8 的倍数。</p>
          )}
          <label className={toolLabelClass}>
            输入二进制（可含空格）
            <ToolCodeMirror
              value={inputBinary}
              onChange={setInputBinary}
              rows={4}
              language="plaintext"
              variant="in"
              placeholder="例如 01001000 01100101 …"
            />
          </label>
          <label className={toolLabelClass}>
            文本输出
            <ToolCodeMirror ref={binToTextOutRef} readOnly value={textFromBinary} rows={4} language="plaintext" variant="out" />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!textFromBinary}
            onClick={() => copy(textFromBinary)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            复制文本
          </button>
        </div>
      </ToolShortcutArea>
      {copyHint ? <p className="text-center text-sm text-gray-600">{copyHint}</p> : null}
    </div>
  )
}
