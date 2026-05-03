'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { markdownToHtml } from '@/lib/tools/logic/markdown-to-html'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE = `# 标题

**粗体** 与 *斜体*，[链接](https://example.com/docs)。

- 列表项
- 另一项

\`\`\`ts
const n = 1
\`\`\`
`

export function MarkdownToHtmlTool() {
  const [md, setMd] = useState(SAMPLE)
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitMsg = assertInputWithinLimit(md)

  const { html, err } = useMemo(() => {
    if (limitMsg) return { html: '', err: '' as string }
    try {
      return { html: markdownToHtml(md), err: '' }
    } catch (e) {
      return { html: '', err: e instanceof Error ? e.message : String(e) }
    }
  }, [md, limitMsg])

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">Markdown 转 HTML</h2>
        <p className="mt-2">
          使用 <strong>marked</strong>（GFM）在浏览器内将 Markdown 转为 HTML 片段，适合文档预览与 CMS 导入。请勿将不可信 Markdown 直接
          <code className="mx-0.5 rounded bg-white px-1 text-xs">dangerouslySetInnerHTML</code>
          渲染到页面。
        </p>
      </section>

      {limitMsg && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{limitMsg}</p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            Markdown 输入
            <ToolCodeMirror value={md} onChange={setMd} rows={14} language="markdown" variant="in" />
          </label>
          <label className={toolLabelClass}>
            HTML 输出
            <ToolCodeMirror ref={outRef} readOnly value={html} rows={14} language="html" variant="out" />
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(html)
              setHint('已复制 HTML')
              window.setTimeout(() => setHint(''), 2000)
            }}
            disabled={!html}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制结果
          </button>
          <button
            type="button"
            onClick={() => setMd(SAMPLE)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            恢复示例
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}

      <section className="border-t border-slate-100 pt-6" aria-labelledby="related-md-html">
        <h2 id="related-md-html" className="text-base font-semibold text-slate-900">
          相关工具
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/html-to-markdown"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              HTML 转 Markdown
            </Link>
          </li>
          <li>
            <Link
              href="/tools/html-stripper"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              HTML 去标签
            </Link>
          </li>
          <li>
            <Link
              href="/tools/js-html-prettify"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              JavaScript / HTML 格式化
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
