'use client'

import { JSONPath } from 'jsonpath-plus'
import { useMemo, useRef, useState } from 'react'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

export function JsonpathTesterTool() {
  const locale = useToolLocale()
  const [jsonText, setJsonText] = useState('{"store":{"book":[{"title":"A"}]}}')
  const [path, setPath] = useState('$.store.book[*].title')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitJ = assertInputWithinLimit(jsonText)
  const limitP = assertInputWithinLimit(path)

  const { out, err } = useMemo(() => {
    if (limitJ || limitP) return { out: '', err: '' as string }
    try {
      const data = JSON.parse(jsonText)
      const r = JSONPath({ path, json: data, wrap: false })
      return { out: JSON.stringify(r, null, 2), err: '' }
    } catch (e) {
      return { out: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [jsonText, path, limitJ, limitP])

  return (
    <div className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {(limitJ || limitP) && <p className="text-sm text-amber-800 lg:col-span-2">{limitJ ?? limitP}</p>}
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className={`${toolLabelClass} lg:col-span-2`}>
          {locale === 'zh' ? (
            <>
              JSONPath（如 <code className="text-xs">$.a.b</code>、<code className="text-xs">$..name</code>）
            </>
          ) : (
            <>
              JSONPath (for example <code className="text-xs">$.a.b</code>, <code className="text-xs">$..name</code>)
            </>
          )}
          <input value={path} onChange={(e) => setPath(e.target.value)} className={toolInputClass} spellCheck={false} />
        </label>
        <label className={toolLabelClass}>
          JSON
          <ToolCodeMirror value={jsonText} onChange={setJsonText} rows={10} language="json" variant="in" />
        </label>
        <label className={toolLabelClass}>
          {locale === 'zh' ? '结果' : 'Output'}
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={10} language="json" variant="out" />
        </label>
      </div>
    </div>
  )
}
