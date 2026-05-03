'use client'

import DOMPurify from 'dompurify'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { htmlToUbb, ubbToHtml } from '@/lib/tools/logic/ubb-html'

type Dir = 'ubb-html' | 'html-ubb'

export function UbbHtmlConverterTool() {
  const [dir, setDir] = useState<Dir>('ubb-html')
  const [ubb, setUbb] = useState('[b]粗体[/b] [url=https://example.com]链接[/url]')
  const [html, setHtml] = useState('<strong>粗体</strong>')
  const ubbHtmlPreviewRef = useRef<ToolCodeEditorHandle | null>(null)
  const htmlUbbOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const previewHtml = useMemo(() => {
    if (dir !== 'ubb-html') return ''
    const raw = ubbToHtml(ubb)
    if (typeof window === 'undefined') return ''
    return DOMPurify.sanitize(raw, { ADD_TAGS: ['img'], ADD_ATTR: ['src', 'alt', 'loading', 'rel'] })
  }, [dir, ubb])

  const ubbOut = useMemo(() => {
    if (dir !== 'html-ubb') return ''
    return htmlToUbb(html)
  }, [dir, html])

  const primaryOutRef = dir === 'ubb-html' ? ubbHtmlPreviewRef : htmlUbbOutRef

  return (
    <ToolShortcutArea focusRef={primaryOutRef} className={toolSectionClass}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDir('ubb-html')}
          className={`rounded-lg border px-3 py-1.5 text-sm ${dir === 'ubb-html' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
        >
          UBB → HTML
        </button>
        <button
          type="button"
          onClick={() => setDir('html-ubb')}
          className={`rounded-lg border px-3 py-1.5 text-sm ${dir === 'html-ubb' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
        >
          HTML → UBB
        </button>
      </div>

      {dir === 'ubb-html' && (
        <>
          <div className={toolConverterEditorGridClass}>
            <label className={toolLabelClass}>
              UBB
              <ToolCodeMirror value={ubb} onChange={setUbb} rows={8} language="plaintext" variant="in" />
            </label>
            <label className={toolLabelClass}>
              HTML 源码
              <ToolCodeMirror
                ref={ubbHtmlPreviewRef}
                readOnly
                value={previewHtml}
                rows={6}
                language="html"
                variant="out"
                className="text-xs [&_.cm-content]:text-xs"
              />
            </label>
          </div>
          <p className="text-xs text-gray-600">已转义显示；安全预览见下方。</p>
          <p className="text-sm font-medium text-gray-800">渲染预览（不可信内容请勿粘贴）</p>
          <div className="rounded-lg border bg-white p-4 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </>
      )}

      {dir === 'html-ubb' && (
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            HTML
            <ToolCodeMirror value={html} onChange={setHtml} rows={10} language="html" variant="in" />
          </label>
          <label className={toolLabelClass}>
            UBB
            <ToolCodeMirror ref={htmlUbbOutRef} readOnly value={ubbOut} rows={10} language="plaintext" variant="out" />
          </label>
        </div>
      )}
    </ToolShortcutArea>
  )
}
