'use client'

import type { Change } from 'diff'
import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'

export function TextDiffTool() {
  const locale = useToolLocale()
  const [left, setLeft] = useState('line1\nline2')
  const [right, setRight] = useState('line1\nline2 changed')
  const [chunks, setChunks] = useState<Change[]>([])
  const [loading, setLoading] = useState(true)
  const outRef = useRef<HTMLPreElement>(null)
  const diffModRef = useRef<typeof import('diff') | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      if (!diffModRef.current) diffModRef.current = await import('diff')
      if (cancelled) return
      const { diffLines } = diffModRef.current
      setChunks(diffLines(left, right))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [left, right])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      {loading ? <p className="text-sm text-slate-600">{locale === 'zh' ? '正在载入对比引擎…' : 'Loading diff engine…'}</p> : null}
      <div className={toolConverterEditorGridClass}>
        <ToolCodeMirror value={left} onChange={setLeft} rows={16} language="plaintext" variant="in" />
        <ToolCodeMirror value={right} onChange={setRight} rows={16} language="plaintext" variant="in" />
      </div>
      <pre
        ref={outRef}
        tabIndex={-1}
        className="max-h-[520px] overflow-auto rounded-lg border bg-white p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-100"
      >
        {!loading &&
          chunks.map((part, i) => (
            <span
              key={i}
              className={
                part.added ? 'bg-green-100 text-green-900' : part.removed ? 'bg-red-100 text-red-900' : 'text-gray-800'
              }
            >
              {part.value}
            </span>
          ))}
      </pre>
    </ToolShortcutArea>
  )
}
