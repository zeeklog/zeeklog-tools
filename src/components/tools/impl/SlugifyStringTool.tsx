'use client'

import { useMemo, useRef, useState } from 'react'
import slugify from '@sindresorhus/slugify'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function SlugifyStringTool() {
  const [input, setInput] = useState('')
  const slug = useMemo(() => {
    try {
      return slugify(input)
    } catch {
      return ''
    }
  }, [input])
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          原始字符串
          <ToolCodeMirror
            value={input}
            onChange={setInput}
            placeholder="例如：My file path"
            rows={4}
            language="plaintext"
            variant="in"
          />
        </label>
        <label className={toolLabelClass}>
          Slug
          <ToolCodeMirror
            ref={outRef}
            readOnly
            value={slug}
            placeholder="例如：my-file-path"
            rows={3}
            language="plaintext"
            variant="out"
          />
        </label>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          disabled={slug.length === 0}
          onClick={async () => {
            await navigator.clipboard.writeText(slug)
            setHint('Slug 已复制')
            window.setTimeout(() => setHint(''), 2000)
          }}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          复制 Slug
        </button>
      </div>
      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}
    </ToolShortcutArea>
  )
}
