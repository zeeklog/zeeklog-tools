'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { htmlToMarkdown } from '@/lib/tools/logic/html-to-markdown'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const SAMPLE_HTML = `<h1>示例标题</h1>
<p>段落与 <strong>粗体</strong>、<em>斜体</em>、<a href="https://example.com/docs">链接</a>。</p>
<ul>
  <li>列表项一</li>
  <li>列表项二</li>
</ul>
<pre><code class="language-ts">const x = 1
console.log(x)</code></pre>`

/** 地址栏预填上限，避免超长 query 拖慢首屏与路由 */
const MAX_HTML_QUERY_CHARS = 12_000

function HtmlToMarkdownToolInner() {
  const searchParams = useSearchParams()
  const [html, setHtml] = useState(SAMPLE_HTML)
  const [hint, setHint] = useState('')
  const [limitError, setLimitError] = useState<string | null>(null)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const seededFromUrl = useRef(false)

  useEffect(() => {
    if (seededFromUrl.current) return
    const raw = searchParams.get('html')
    if (raw == null || raw === '') return
    try {
      const decoded = decodeURIComponent(raw)
      if (decoded.length > MAX_HTML_QUERY_CHARS) {
        setLimitError(
          `地址栏中的 html 参数过长（>${MAX_HTML_QUERY_CHARS} 字符），已忽略；请改用粘贴输入。`
        )
        seededFromUrl.current = true
        return
      }
      const err = assertInputWithinLimit(decoded)
      if (err) {
        setLimitError(err)
        seededFromUrl.current = true
        return
      }
      setHtml(decoded)
      seededFromUrl.current = true
    } catch {
      seededFromUrl.current = true
    }
  }, [searchParams])

  const limitMsg = assertInputWithinLimit(html)
  const markdown = useMemo(() => {
    if (limitMsg) return ''
    try {
      return htmlToMarkdown(html)
    } catch {
      return ''
    }
  }, [html, limitMsg])

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">将 HTML 转为 Markdown</h2>
        <p className="mt-2">
          在下方粘贴页面片段或富文本导出结果，即可得到{' '}
          <strong>GitHub Flavored Markdown</strong> 风格文本（标题、列表、链接、代码块、表格等）。全部在浏览器内完成，不上传服务器。
        </p>
        <p className="mt-2 text-slate-600">
          支持通过链接预填内容（须 URL 编码）：{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-800">
            /tools/html-to-markdown?html=%3Ch1%3E...%3C%2Fh1%3E
          </code>
          ，建议仅用于较短片段。
        </p>
      </section>

      {(limitError || limitMsg) && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {limitError ?? limitMsg}
        </p>
      )}

      <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            HTML 输入
            <ToolCodeMirror
              value={html}
              onChange={(v) => {
                setHtml(v)
                setLimitError(null)
              }}
              rows={14}
              language="html"
              variant="in"
            />
          </label>
          <label className={toolLabelClass}>
            Markdown 输出
            <ToolCodeMirror ref={outRef} readOnly value={markdown} rows={14} language="markdown" variant="out" />
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(markdown)
              setHint('已复制 Markdown')
              window.setTimeout(() => setHint(''), 2000)
            }}
            disabled={!markdown}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            复制结果
          </button>
          <button
            type="button"
            onClick={() => setHtml(SAMPLE_HTML)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            恢复示例
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}

      <section className="border-t border-slate-100 pt-6" aria-labelledby="related-tools-heading">
        <h2 id="related-tools-heading" className="text-base font-semibold text-slate-900">
          相关工具
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          与 Markdown 互转、去标签或编辑 HTML 时可配合使用：
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/markdown-to-html"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              Markdown 转 HTML
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
              href="/tools/html-wysiwyg-editor"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              HTML 所见即所得编辑器
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
          <li>
            <Link
              href="/tools/ubb-html-converter"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              UBB 与 HTML 互转
            </Link>
          </li>
          <li>
            <Link
              href="/tools/html-entities"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              HTML 实体转义
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}

export function HtmlToMarkdownTool() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
          正在加载工具…
        </div>
      }
    >
      <HtmlToMarkdownToolInner />
    </Suspense>
  )
}
