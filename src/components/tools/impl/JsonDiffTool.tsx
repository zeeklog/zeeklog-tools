'use client'

import type { Change } from 'diff'
import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function JsonDiffTool() {
  const [left, setLeft] = useState('{"a":1}')
  const [right, setRight] = useState('{"a":2}')
  const [chunks, setChunks] = useState<Change[] | null>(null)
  const [loading, setLoading] = useState(true)
  const outRef = useRef<HTMLPreElement>(null)
  const diffModRef = useRef<typeof import('diff') | null>(null)
  const json5Ref = useRef<import('json5').default | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      if (!diffModRef.current) diffModRef.current = await import('diff')
      if (!json5Ref.current) json5Ref.current = (await import('json5')).default
      if (cancelled) return
      const { diffLines } = diffModRef.current
      const JSON5 = json5Ref.current
      try {
        const a = JSON5.parse(left)
        const b = JSON5.parse(right)
        const ls = JSON.stringify(a, null, 2)
        const rs = JSON.stringify(b, null, 2)
        setChunks(diffLines(ls, rs))
      } catch {
        setChunks(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [left, right])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        <ToolCodeMirror value={left} onChange={setLeft} rows={14} language="json" variant="in" className="[&_.cm-content]:text-xs" />
        <ToolCodeMirror value={right} onChange={setRight} rows={14} language="json" variant="in" className="[&_.cm-content]:text-xs" />
      </div>
      {loading ? <p className="text-sm text-slate-600">正在载入对比引擎…</p> : null}
      {!loading && chunks === null ? <p className="text-sm text-red-600">两侧都必须是合法 JSON</p> : null}
      <pre
        ref={outRef}
        tabIndex={-1}
        className={`font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-orange-100 ${
          !loading && chunks
            ? 'max-h-[480px] overflow-auto rounded-lg border bg-white p-3'
            : 'sr-only'
        }`}
      >
        {!loading && chunks
          ? chunks.map((part, i) => (
              <span
                key={i}
                className={
                  part.added ? 'bg-green-100 text-green-900' : part.removed ? 'bg-red-100 text-red-900' : 'text-gray-800'
                }
              >
                {part.value}
              </span>
            ))
          : null}
      </pre>
    </ToolShortcutArea>
  )
}
