'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { htmlFragmentToJsx } from '@/lib/tools/logic/html-to-jsx'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE = `<div class="wrap">
  <img src="/x.png" alt="图" />
  <p>Hello <strong>world</strong></p>
</div>`

export function HtmlToJsxTool() {
  const [html, setHtml] = useState(SAMPLE)
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitMsg = assertInputWithinLimit(html)

  const { jsx, err } = useMemo(() => {
    if (typeof document === 'undefined') return { jsx: '', err: '' as string }
    if (limitMsg) return { jsx: '', err: '' as string }
    try {
      return { jsx: htmlFragmentToJsx(html), err: '' }
    } catch (e) {
      return { jsx: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [html, limitMsg])

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">HTML 片段转 JSX</h2>
        <p className="mt-2">
          将常见属性映射为 React 写法（如 <code className="rounded bg-white px-1 text-xs">className</code>）、自闭合标签与文本中的{' '}
          <code className="rounded bg-white px-1 text-xs">{'{}'}</code> 转义。<strong>style 对象、事件名、条件渲染</strong>等需自行调整。
        </p>
      </section>

      {limitMsg && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{limitMsg}</p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            HTML 输入
            <ToolCodeMirror value={html} onChange={setHtml} rows={12} language="html" variant="in" />
          </label>
          <label className={toolLabelClass}>
            JSX 输出
            <ToolCodeMirror ref={outRef} readOnly value={jsx} rows={14} language="jsx" variant="out" />
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(jsx)
              setHint('已复制')
              window.setTimeout(() => setHint(''), 2000)
            }}
            disabled={!jsx}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制结果
          </button>
          <button
            type="button"
            onClick={() => setHtml(SAMPLE)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            恢复示例
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">相关工具</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/js-html-prettify"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JS / HTML 格式化
            </Link>
          </li>
          <li>
            <Link
              href="/tools/html-to-markdown"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              HTML 转 Markdown
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
