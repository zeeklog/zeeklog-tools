'use client'

import { useEffect, useRef, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

export function XmlDiffTool() {
  const [a, setA] = useState('<root><x>1</x></root>')
  const [b, setB] = useState('<root><x>2</x></root>')
  const [diffHtml, setDiffHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const diffModRef = useRef<typeof import('diff') | null>(null)
  const xmlFormatterModRef = useRef<typeof import('xml-formatter') | null>(null)
  const la = assertInputWithinLimit(a)
  const lb = assertInputWithinLimit(b)

  useEffect(() => {
    let cancelled = false
    if (la || lb) {
      setDiffHtml('')
      setLoading(false)
      return
    }
    setLoading(true)
    ;(async () => {
      if (!diffModRef.current) diffModRef.current = await import('diff')
      if (!xmlFormatterModRef.current) xmlFormatterModRef.current = await import('xml-formatter')
      const { diffLines } = diffModRef.current
      const formatXml = xmlFormatterModRef.current.default
      if (cancelled) return
      try {
        const fa = formatXml(a.trim(), { collapseContent: true, indentation: '  ' })
        const fb = formatXml(b.trim(), { collapseContent: true, indentation: '  ' })
        const parts = diffLines(fa, fb)
        const html = parts
          .map((p) => {
            const cls = p.added ? 'bg-green-100' : p.removed ? 'bg-red-100' : 'text-slate-600'
            const sign = p.added ? '+' : p.removed ? '-' : ' '
            const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            return p.value
              .split('\n')
              .map((line) => `<span class="${cls}">${sign} ${esc(line)}\n</span>`)
              .join('')
          })
          .join('')
        setDiffHtml(html)
      } catch {
        setDiffHtml('<p class="text-red-600">XML 格式化失败，请检查两侧均为可解析的 XML</p>')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [a, b, la, lb])

  return (
    <div className={toolSectionClass}>
      {(la || lb) && <p className="text-sm text-amber-800">{la ?? lb}</p>}
      {loading && !(la || lb) ? <p className="text-sm text-slate-600">正在载入对比与格式化…</p> : null}
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          XML A
          <ToolCodeMirror value={a} onChange={setA} rows={12} language="xml" variant="in" />
        </label>
        <label className={toolLabelClass}>
          XML B
          <ToolCodeMirror value={b} onChange={setB} rows={12} language="xml" variant="in" />
        </label>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-800">差异（先格式化再按行对比）</h3>
        <pre
          className="mt-2 max-h-[28rem] overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3 font-mono text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: diffHtml || '—' }}
        />
      </div>
    </div>
  )
}
