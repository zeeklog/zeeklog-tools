'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { jsonlToJsonArray, jsonToJsonl } from '@/lib/tools/logic/json-jsonl'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Mode = 'to-jsonl' | 'to-array'

const SAMPLE_JSON = `[
  {"id": 1, "msg": "a"},
  {"id": 2, "msg": "b"}
]`

const SAMPLE_JSONL = `{"id":1,"msg":"a"}
{"id":2,"msg":"b"}`

export function JsonJsonlTool() {
  const [mode, setMode] = useState<Mode>('to-jsonl')
  const [raw, setRaw] = useState(SAMPLE_JSON)
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitMsg = assertInputWithinLimit(raw)

  const result = useMemo(() => {
    if (limitMsg) return { text: '', err: '' as string }
    const r = mode === 'to-jsonl' ? jsonToJsonl(raw) : jsonlToJsonArray(raw)
    if (!r.ok) return { text: '', err: r.message }
    return { text: r.text, err: '' }
  }, [raw, mode, limitMsg])

  const inLang: ToolCodemirrorLang = mode === 'to-jsonl' ? 'json' : 'plaintext'
  const outLang: ToolCodemirrorLang = mode === 'to-jsonl' ? 'plaintext' : 'json'

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">JSON 与 JSONL 互转</h2>
        <p className="mt-2">
          JSONL（NDJSON）每行一条合法 JSON；将<strong>数组</strong>展开为多行，或将多行合并为<strong>数组</strong>。单行 JSON
          对象在「转 JSONL」时输出一行。
        </p>
      </section>

      {limitMsg && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{limitMsg}</p>
      )}

      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-800">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="jj-mode"
            checked={mode === 'to-jsonl'}
            onChange={() => {
              setMode('to-jsonl')
              setRaw(SAMPLE_JSON)
            }}
          />
          JSON → JSONL
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="jj-mode"
            checked={mode === 'to-array'}
            onChange={() => {
              setMode('to-array')
              setRaw(SAMPLE_JSONL)
            }}
          />
          JSONL → JSON 数组
        </label>
      </div>

      <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          {result.err && <p className="text-sm text-red-600 lg:col-span-2">{result.err}</p>}
          <label className={toolLabelClass}>
            输入
            <ToolCodeMirror value={raw} onChange={setRaw} rows={12} language={inLang} variant="in" />
          </label>
          <label className={toolLabelClass}>
            输出
            <ToolCodeMirror ref={outRef} readOnly value={result.text} rows={12} language={outLang} variant="out" />
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(result.text)
              setHint('已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            disabled={!result.text}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制结果
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">相关工具</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/json-prettify"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JSON 美化
            </Link>
          </li>
          <li>
            <Link
              href="/tools/json-minify"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JSON 压缩
            </Link>
          </li>
          <li>
            <Link
              href="/tools/json-syntax-helper"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JSON 语法定位
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
