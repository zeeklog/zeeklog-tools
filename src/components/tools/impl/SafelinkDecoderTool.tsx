'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { decodeSafeLinksURL } from '@/lib/tools/logic/safelink'

export function SafelinkDecoderTool() {
  const locale = useToolLocale()
  const [input, setInput] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const output = useMemo(() => {
    try {
      return decodeSafeLinksURL(input.trim())
    } catch (e) {
      return e instanceof Error ? e.message : String(e)
    }
  }, [input])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          Outlook SafeLinks URL
          <ToolCodeMirror
            value={input}
            onChange={setInput}
            rows={3}
            language="plaintext"
            variant="in"
            placeholder="https://*.safelinks.protection.outlook.com/..."
          />
        </label>
        <label className={toolLabelClass}>
          {locale === 'zh' ? '解码结果' : 'Decoded output'}
          <ToolCodeMirror
            ref={outRef}
            readOnly
            value={output}
            rows={4}
            language="plaintext"
            variant="out"
            className="break-all"
          />
        </label>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(output)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
        >
          {locale === 'zh' ? '复制结果' : 'Copy output'}
        </button>
      </div>
    </ToolShortcutArea>
  )
}
