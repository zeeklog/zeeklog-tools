'use client'

import { EditorView } from '@codemirror/view'
import { useCallback, useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export type ImageDataUriHelperToolProps = {
  /** SEO 入口：优先展示编码或解码区 */
  initialSection?: 'encode' | 'decode'
}

export function ImageDataUriHelperTool({ initialSection = 'encode' }: ImageDataUriHelperToolProps = {}) {
  const [b64, setB64] = useState('')
  const [pastePreview, setPastePreview] = useState('')
  const [snippet, setSnippet] = useState({ dataUri: '', imgTag: '', cssBg: '' })

  const selectAllOnFocus = useMemo(
    () =>
      EditorView.domEventHandlers({
        focus(_event, view) {
          const len = view.state.doc.length
          if (len > 0) {
            view.dispatch({ selection: { anchor: 0, head: len } })
          }
          return false
        },
      }),
    [],
  )

  const onFile = useCallback((file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const r = reader.result
      if (typeof r !== 'string') return
      const comma = r.indexOf(',')
      const raw = comma >= 0 ? r.slice(comma + 1) : r
      const mime = comma >= 0 && r.startsWith('data:') ? r.slice(5, comma) : file.type || 'image/png'
      const dataUri = comma >= 0 ? r : `data:${mime};base64,${raw}`
      setB64(raw)
      setSnippet({
        dataUri,
        imgTag: `<img alt="" src="${dataUri}" />`,
        cssBg: `background-image: url("${dataUri}");`,
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const onPasteDecode = useCallback(() => {
    const t = pastePreview.trim()
    if (!t) {
      setPastePreview('')
      return
    }
    let s = t
    if (s.includes('base64,')) {
      const i = s.indexOf('base64,')
      s = s.slice(i + 7)
    }
    s = s.replace(/\s/g, '')
    setB64(s)
    const mime = t.includes('image/jpeg') || t.includes('.jpg') ? 'image/jpeg' : 'image/png'
    const dataUri = `data:${mime};base64,${s}`
    setSnippet({
      dataUri,
      imgTag: `<img alt="" src="${dataUri}" />`,
      cssBg: `background-image: url("${dataUri}");`,
    })
  }, [pastePreview])

  const encodeBlock = (
    <div>
      <p className="mb-2 text-sm text-slate-600">上传图片生成 Data URI 与片段（仅浏览器本地处理）。</p>
      <label className={toolLabelClass}>
        选择图片
        <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      </label>
      {snippet.dataUri && (
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-medium text-slate-800">Data URI（节选）</p>
          <ToolCodeMirror
            readOnly
            rows={3}
            language="plaintext"
            variant="out"
            value={snippet.dataUri.slice(0, 200) + (snippet.dataUri.length > 200 ? '…' : '')}
          />
          <p className="font-medium text-slate-800">HTML</p>
          <ToolCodeMirror
            readOnly
            rows={2}
            language="html"
            variant="out"
            value={snippet.imgTag}
            extraExtensions={[selectAllOnFocus]}
          />
          <p className="font-medium text-slate-800">CSS</p>
          <ToolCodeMirror
            readOnly
            rows={2}
            language="css"
            variant="out"
            value={snippet.cssBg}
            extraExtensions={[selectAllOnFocus]}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={snippet.dataUri} alt="preview" className="mt-2 max-h-48 max-w-full rounded border border-slate-200" />
        </div>
      )}
    </div>
  )

  const decodeBlock = (
    <div>
      <p className="mb-2 text-sm text-slate-600">粘贴 Base64 或含 data: 前缀的字符串，解析后预览。</p>
      <div className={toolConverterEditorGridClass}>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <span className="text-sm font-medium text-slate-800">粘贴内容</span>
          <ToolCodeMirror
            value={pastePreview}
            onChange={setPastePreview}
            rows={4}
            language="plaintext"
            variant="in"
            placeholder="data:image/png;base64,... 或纯 Base64"
          />
          <button type="button" onClick={onPasteDecode} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white">
            解析并预览
          </button>
        </div>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <span className="text-sm font-medium text-slate-800">预览</span>
          {b64 && snippet.dataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={snippet.dataUri} alt="decoded" className="max-h-48 max-w-full rounded border border-slate-200" />
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-8 text-center text-xs text-slate-500">
              解析成功后在此显示图片
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`space-y-8 ${toolSectionClass}`}>
      {initialSection === 'decode' ? (
        <>
          {decodeBlock}
          {encodeBlock}
        </>
      ) : (
        <>
          {encodeBlock}
          {decodeBlock}
        </>
      )}
    </div>
  )
}
