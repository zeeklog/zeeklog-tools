'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { analyzeJsonSyntax } from '@/lib/tools/logic/json-syntax'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE = `{
  "ok": true,
  "items": [1, 2,]
}`

export function JsonSyntaxHelperTool() {
  const [raw, setRaw] = useState(SAMPLE)
  const limitMsg = assertInputWithinLimit(raw)

  const report = useMemo(() => {
    if (limitMsg) return null
    return analyzeJsonSyntax(raw)
  }, [raw, limitMsg])

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">JSON 语法检查与错误定位</h2>
        <p className="mt-2">
          调用 <code className="rounded bg-white px-1 text-xs">JSON.parse</code> 并解析引擎报错中的位置信息，给出大致<strong>行、列</strong>与片段。不做自动修复；修复请配合编辑器或
          <Link href="/tools/json-prettify" className="text-orange-700 underline">
            JSON 美化
          </Link>
          。
        </p>
      </section>

      {limitMsg && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{limitMsg}</p>
      )}

      <div className={toolSectionClass}>
        <label className={toolLabelClass}>
          JSON 文本
          <ToolCodeMirror value={raw} onChange={setRaw} rows={14} language="json" variant="in" />
        </label>

        {report && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              report.ok
                ? 'border-green-200 bg-green-50/80 text-green-900'
                : 'border-red-200 bg-red-50/80 text-red-900'
            }`}
            role="status"
          >
            {report.ok ? (
              <p>语法合法（空内容视为通过）。</p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">解析失败</p>
                <p>行 {report.line}，列 {report.column}</p>
                <p className="break-all font-mono text-xs opacity-90">{report.message}</p>
                <p className="text-xs text-slate-700">
                  片段：<span className="font-mono break-all">{report.excerpt}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">相关工具</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/json-jsonl-converter"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JSON ↔ JSONL
            </Link>
          </li>
          <li>
            <Link
              href="/tools/json-diff"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JSON 对比
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
