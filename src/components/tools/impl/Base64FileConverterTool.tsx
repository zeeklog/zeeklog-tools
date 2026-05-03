'use client'

import { useCallback, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { downloadFileFromBase64 } from '@/lib/tools/logic/base64-file'
import { isValidBase64 } from '@/lib/tools/logic/base64-convert'

export function Base64FileConverterTool() {
  const [base64Input, setBase64Input] = useState('')
  const [fileBase64, setFileBase64] = useState('')
  const [hint, setHint] = useState('')
  const base64ToFileFocusRef = useRef<ToolCodeEditorHandle | null>(null)
  const fileToBase64OutRef = useRef<ToolCodeEditorHandle | null>(null)

  const base64Valid = base64Input.trim() === '' || isValidBase64(base64Input.trim())

  const onFile = useCallback((file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const r = reader.result
      if (typeof r !== 'string') return
      const comma = r.indexOf(',')
      setFileBase64(comma >= 0 ? r.slice(comma + 1) : r)
    }
    reader.readAsDataURL(file)
  }, [])

  const download = () => {
    if (!base64Valid || base64Input.trim() === '') return
    downloadFileFromBase64(base64Input.trim())
  }

  const copyFileB64 = async () => {
    if (!fileBase64) return
    await navigator.clipboard.writeText(fileBase64)
    setHint('Base64 已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <div className="space-y-10">
      <ToolShortcutArea
        focusRef={base64ToFileFocusRef}
        showShortcutHint={false}
        className={toolSectionClass}
        run={download}
        canRun={base64Input.trim() !== '' && base64Valid}
      >
        <h2 className="text-base font-semibold text-gray-900">Base64 → 文件下载</h2>
        <ToolCodeMirror
          ref={base64ToFileFocusRef}
          value={base64Input}
          onChange={setBase64Input}
          rows={5}
          language="plaintext"
          variant="in"
          placeholder="粘贴 Base64（可含 data:mime;base64, 前缀）"
        />
        {!base64Valid && <p className="text-sm text-red-600">无效的 Base64 字符串。</p>}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={base64Input.trim() === '' || !base64Valid}
            onClick={download}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            下载文件
          </button>
        </div>
      </ToolShortcutArea>

      <ToolShortcutArea focusRef={fileToBase64OutRef} className={toolSectionClass}>
        <h2 className="text-base font-semibold text-gray-900">文件 → Base64</h2>
        <div className={toolConverterEditorGridClass}>
          <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-10 text-sm text-gray-600 hover:border-orange-300">
            <span>点击或拖放文件到此处</span>
            <input
              type="file"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className={toolLabelClass}>
            Base64
            <ToolCodeMirror
              ref={fileToBase64OutRef}
              readOnly
              value={fileBase64}
              rows={5}
              language="plaintext"
              variant="out"
              placeholder="选择文件后，此处显示纯 Base64"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!fileBase64}
            onClick={copyFileB64}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            复制 Base64
          </button>
        </div>
      </ToolShortcutArea>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </div>
  )
}
