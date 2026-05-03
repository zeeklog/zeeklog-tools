'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'
import { formatBytes, getStringSizeInBytes } from '@/lib/tools/logic/format-bytes'

export function TextStatisticsTool() {
  const [text, setText] = useState('')
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = useMemo(() => {
    const charCount = text.length
    const wordCount = text === '' ? 0 : text.split(/\s+/).filter(Boolean).length
    const lineCount = text === '' ? 0 : text.split(/\r\n|\r|\n/).length
    const byteSize = formatBytes(getStringSizeInBytes(text))
    return { charCount, wordCount, lineCount, byteSize }
  }, [text])

  return (
    <ToolShortcutArea focusRef={statsRef} className={toolSectionClass}>
      <ToolCodeMirror
        value={text}
        onChange={setText}
        rows={6}
        language="plaintext"
        variant="in"
        placeholder="在此输入文本…"
      />
      <div
        ref={statsRef}
        tabIndex={-1}
        className="grid grid-cols-2 gap-4 outline-none focus:ring-2 focus:ring-orange-100 sm:grid-cols-4"
      >
        <Stat label="字符数" value={String(stats.charCount)} />
        <Stat label="词数" value={String(stats.wordCount)} />
        <Stat label="行数" value={String(stats.lineCount)} />
        <Stat label="字节（UTF-8）" value={stats.byteSize} />
      </div>
    </ToolShortcutArea>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4 text-center">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{label}</div>
    </div>
  )
}
