'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

export function XpathTesterTool() {
  const [xml, setXml] = useState(`<?xml version="1.0"?>\n<root><item id="1">a</item><item id="2">b</item></root>`)
  const [xpath, setXpath] = useState('//item/text()')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitXml = assertInputWithinLimit(xml)
  const limitXp = assertInputWithinLimit(xpath)

  const { out, err } = useMemo(() => {
    if (typeof document === 'undefined') return { out: '', err: '' as string }
    if (limitXml || limitXp) return { out: '', err: '' as string }
    try {
      const doc = new DOMParser().parseFromString(xml, 'text/xml')
      const pe = doc.querySelector('parsererror')
      if (pe) return { out: '', err: 'XML 解析失败（非良构或命名空间问题）' }
      const res = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      const lines: string[] = []
      for (let i = 0; i < res.snapshotLength; i++) {
        const n = res.snapshotItem(i)
        lines.push(n?.textContent ?? n?.nodeValue ?? String(n))
      }
      return { out: lines.join('\n'), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [xml, xpath, limitXml, limitXp])

  const outLang: ToolCodemirrorLang = 'plaintext'

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">适用于 XML 文档。HTML 若未闭合标签可能解析失败。</p>
      <div className={toolConverterEditorGridClass}>
        {(limitXml || limitXp) && <p className="text-sm text-amber-800 lg:col-span-2">{limitXml ?? limitXp}</p>}
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className={`${toolLabelClass} lg:col-span-2`}>
          XPath 表达式
          <input value={xpath} onChange={(e) => setXpath(e.target.value)} className={toolInputClass} spellCheck={false} />
        </label>
        <label className={toolLabelClass}>
          XML
          <ToolCodeMirror value={xml} onChange={setXml} rows={10} language="xml" variant="in" />
        </label>
        <label className={toolLabelClass}>
          匹配结果（每行一个节点文本）
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={8} language={outLang} variant="out" />
        </label>
      </div>
    </div>
  )
}
