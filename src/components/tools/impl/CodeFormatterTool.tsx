'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type ParserId = 'babel' | 'typescript' | 'json' | 'html' | 'markdown' | 'yaml'

const PARSERS: { id: ParserId; label: string }[] = [
  { id: 'babel', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON' },
  { id: 'html', label: 'HTML' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'yaml', label: 'YAML' },
]

function parserToCmLang(id: ParserId): ToolCodemirrorLang {
  const m: Record<ParserId, ToolCodemirrorLang> = {
    babel: 'javascript',
    typescript: 'typescript',
    json: 'json',
    html: 'html',
    markdown: 'markdown',
    yaml: 'yaml',
  }
  return m[id]
}

export function CodeFormatterTool() {
  const [parser, setParser] = useState<ParserId>('babel')
  const [input, setInput] = useState('const x=1\n')
  const [output, setOutput] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const cmLang = useMemo(() => parserToCmLang(parser), [parser])

  const run = async () => {
    setErr('')
    const limitMsg = assertInputWithinLimit(input)
    if (limitMsg) {
      setErr(limitMsg)
      setOutput('')
      return
    }
    setLoading(true)
    try {
      const prettier = await import('prettier/standalone')
      const plugins: object[] = []

      if (parser === 'typescript') {
        const ts = await import('prettier/plugins/typescript')
        plugins.push(ts.default)
      } else if (parser === 'babel' || parser === 'json') {
        const estree = await import('prettier/plugins/estree')
        const babel = await import('prettier/plugins/babel')
        plugins.push(estree.default, babel.default)
      }
      if (parser === 'html') {
        const html = await import('prettier/plugins/html')
        plugins.push(html.default)
      }
      if (parser === 'markdown') {
        const md = await import('prettier/plugins/markdown')
        plugins.push(md.default)
      }
      if (parser === 'yaml') {
        const yaml = await import('prettier/plugins/yaml')
        plugins.push(yaml.default)
      }

      const formatted = await prettier.format(input, {
        parser,
        plugins,
      })
      setOutput(formatted)
    } catch (e) {
      setOutput('')
      setErr(e instanceof Error ? e.message : '格式化失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShortcutArea run={() => void run()} canRun={!loading && input.trim() !== ''} focusRef={outRef} className={toolSectionClass}>
      <p className="text-sm text-slate-600">基于 Prettier。与「JavaScript / HTML 格式化」页功能重叠时可任选其一。</p>
      <div className="flex flex-wrap gap-2">
        {PARSERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setParser(p.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${parser === p.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className={toolConverterEditorGridClass}>
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          输入
          <ToolCodeMirror value={input} onChange={setInput} rows={12} language={cmLang} variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          输出
          <ToolCodeMirror ref={outRef} readOnly value={output} rows={14} language={cmLang} variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
