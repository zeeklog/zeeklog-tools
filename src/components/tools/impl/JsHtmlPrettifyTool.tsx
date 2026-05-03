'use client'

import { useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Lang = 'js' | 'html'

export function JsHtmlPrettifyTool() {
  const [lang, setLang] = useState<Lang>('js')
  const [input, setInput] = useState('const a={b:1};')
  const [output, setOutput] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const cmLang: ToolCodemirrorLang = lang === 'js' ? 'javascript' : 'html'

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
      if (lang === 'js') {
        const [estree, babel] = await Promise.all([import('prettier/plugins/estree'), import('prettier/plugins/babel')])
        const plugins = [estree.default, babel.default]
        const formatted = await prettier.format(input, {
          parser: 'babel',
          plugins,
        })
        setOutput(formatted)
      } else {
        const html = await import('prettier/plugins/html')
        const formatted = await prettier.format(input, {
          parser: 'html',
          plugins: [html.default],
        })
        setOutput(formatted)
      }
    } catch (e) {
      setOutput('')
      setErr(e instanceof Error ? e.message : '格式化失败')
    } finally {
      setLoading(false)
    }
  }

  const canRun = !loading && input.trim() !== ''

  return (
    <ToolShortcutArea run={() => void run()} canRun={canRun} focusRef={outRef} className={toolSectionClass}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLang('js')}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
            lang === 'js' ? 'border-orange-500 bg-orange-50 text-orange-950' : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200'
          }`}
        >
          JavaScript
        </button>
        <button
          type="button"
          onClick={() => setLang('html')}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
            lang === 'html' ? 'border-orange-500 bg-orange-50 text-orange-950' : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200'
          }`}
        >
          HTML
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void run()}
          className="ml-auto rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '处理中…' : '格式化'}
        </button>
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
