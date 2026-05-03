'use client'

import { useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

export function CssBeautifyMinifyTool() {
  const [input, setInput] = useState('.a{color:red}')
  const [output, setOutput] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

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
      if (mode === 'minify') {
        const { minify: cssoMinify } = await import('csso')
        const r = cssoMinify(input, { restructure: true })
        setOutput(r.css)
        setErr(r.warnings?.length ? `csso 警告：${r.warnings.map((w: { message: string }) => w.message).join('; ')}` : '')
      } else {
        const prettier = await import('prettier/standalone')
        const postcss = await import('prettier/plugins/postcss')
        const formatted = await prettier.format(input, {
          parser: 'css',
          plugins: [postcss.default],
        })
        setOutput(formatted)
      }
    } catch (e) {
      setOutput('')
      setErr(e instanceof Error ? e.message : '处理失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShortcutArea run={() => void run()} canRun={!loading && input.trim() !== ''} focusRef={outRef} className={toolSectionClass}>
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode('beautify')}
          className={`rounded-lg border px-3 py-1.5 ${mode === 'beautify' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
        >
          美化（Prettier）
        </button>
        <button
          type="button"
          onClick={() => setMode('minify')}
          className={`rounded-lg border px-3 py-1.5 ${mode === 'minify' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
        >
          压缩（csso）
        </button>
      </div>
      <div className={toolConverterEditorGridClass}>
        {err && mode === 'minify' && (
          <p
            className={`text-sm lg:col-span-2 ${err.startsWith('csso 警告') ? 'text-amber-800' : 'text-red-600'}`}
          >
            {err}
          </p>
        )}
        {err && mode === 'beautify' && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          CSS
          <ToolCodeMirror value={input} onChange={setInput} rows={12} language="css" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          结果
          <ToolCodeMirror ref={outRef} readOnly value={output} rows={12} language="css" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
