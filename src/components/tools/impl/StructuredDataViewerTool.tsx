'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Kind = 'json' | 'yaml' | 'xml'

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  if (data === null || data === undefined) {
    return <span className="text-slate-500">{String(data)}</span>
  }
  if (typeof data !== 'object') {
    return <span className="text-orange-800">{JSON.stringify(data)}</span>
  }
  if (Array.isArray(data)) {
    return (
      <ul className={`ml-4 list-disc border-l border-slate-200 pl-2 ${depth > 0 ? 'mt-1' : ''}`}>
        {data.map((item, i) => (
          <li key={i} className="text-sm">
            <JsonTree data={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    )
  }
  const entries = Object.entries(data as Record<string, unknown>)
  return (
    <ul className={`ml-4 space-y-1 border-l border-slate-200 pl-2 ${depth > 0 ? 'mt-1' : ''}`}>
      {entries.map(([k, v]) => (
        <li key={k} className="text-sm">
          <span className="font-mono text-slate-600">{k}:</span>{' '}
          <JsonTree data={v} depth={depth + 1} />
        </li>
      ))}
    </ul>
  )
}

function xmlToLooseJson(el: Element): unknown {
  const kids = [...el.children]
  if (kids.length === 0) return el.textContent ?? ''
  const o: Record<string, unknown> = {}
  for (const c of kids) {
    const name = c.tagName
    const v = xmlToLooseJson(c)
    if (o[name] !== undefined) {
      const cur = o[name]
      o[name] = Array.isArray(cur) ? [...cur, v] : [cur, v]
    } else {
      o[name] = v
    }
  }
  return o
}

export function StructuredDataViewerTool() {
  const [kind, setKind] = useState<Kind>('json')
  const [text, setText] = useState('{"a":1,"b":[2,3]}')
  const limitMsg = assertInputWithinLimit(text)

  const [yamlState, setYamlState] = useState<{
    tree: unknown | null
    err: string
    pending: boolean
  } | null>(null)
  const yamlModRef = useRef<typeof import('yaml') | null>(null)

  const { tree: jsonXmlTree, err: jsonXmlErr } = useMemo(() => {
    if (limitMsg || kind === 'yaml') return { tree: null as unknown, err: '' as string }
    try {
      if (kind === 'json') {
        return { tree: JSON.parse(text), err: '' }
      }
      if (typeof document === 'undefined') return { tree: null, err: '' }
      const doc = new DOMParser().parseFromString(text, 'text/xml')
      if (doc.querySelector('parsererror')) return { tree: null, err: 'XML 解析失败' }
      const root = doc.documentElement
      return { tree: { [root.tagName]: xmlToLooseJson(root) }, err: '' }
    } catch (e) {
      return { tree: null, err: e instanceof Error ? e.message : String(e) }
    }
  }, [text, kind, limitMsg])

  useEffect(() => {
    if (kind !== 'yaml') {
      setYamlState(null)
      return
    }
    if (limitMsg) {
      setYamlState(null)
      return
    }
    setYamlState({ tree: null, err: '', pending: true })
    let cancelled = false
    ;(async () => {
      if (!yamlModRef.current) {
        yamlModRef.current = await import('yaml')
      }
      const YAML = yamlModRef.current
      if (cancelled) return
      try {
        setYamlState({ tree: YAML.parse(text), err: '', pending: false })
      } catch (e) {
        setYamlState({
          tree: null,
          err: e instanceof Error ? e.message : String(e),
          pending: false,
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [kind, text, limitMsg])

  const tree = kind === 'yaml' ? yamlState?.tree : jsonXmlTree
  const err = kind === 'yaml' ? yamlState?.err : jsonXmlErr
  const yamlPending = kind === 'yaml' && yamlState?.pending

  const editorLang: ToolCodemirrorLang = kind === 'json' ? 'json' : kind === 'yaml' ? 'yaml' : 'xml'

  return (
    <div className={toolSectionClass}>
      <div className="flex flex-wrap gap-2 text-sm">
        {(['json', 'yaml', 'xml'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-lg border px-3 py-1.5 uppercase ${kind === k ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
          >
            {k}
          </button>
        ))}
      </div>
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      {yamlPending ? <p className="text-sm text-slate-600">正在加载 YAML 解析…</p> : null}
      {err && !yamlPending ? <p className="text-sm text-red-600">{err}</p> : null}
      <label className={toolLabelClass}>
        输入
        <ToolCodeMirror value={text} onChange={setText} rows={12} language={editorLang} variant="in" />
      </label>
      {tree != null && !err && !yamlPending && (
        <div className="max-h-[32rem] overflow-auto rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <JsonTree data={tree} />
        </div>
      )}
    </div>
  )
}
