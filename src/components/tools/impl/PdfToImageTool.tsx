'use client'

import { useCallback, useState } from 'react'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

const PDFJS_VER = '5.6.205'

export type PdfToImageToolProps = {
  initialMime?: 'image/jpeg' | 'image/png'
}

export function PdfToImageTool({ initialMime = 'image/jpeg' }: PdfToImageToolProps = {}) {
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>(initialMime)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [pages, setPages] = useState<{ url: string; name: string }[]>([])

  const onPdf = useCallback(
    async (file: File | null) => {
      setErr('')
      setPages((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url))
        return []
      })
      if (!file) return
      setBusy(true)
      try {
        const { getDocument, GlobalWorkerOptions, version } = await import('pdfjs-dist')
        GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version ?? PDFJS_VER}/build/pdf.worker.mjs`
        const data = new Uint8Array(await file.arrayBuffer())
        const pdf = await getDocument({ data }).promise
        const next: { url: string; name: string }[] = []
        const ext = format === 'image/jpeg' ? 'jpg' : 'png'
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const scale = 2
          const vp = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = vp.width
          canvas.height = vp.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Canvas 不可用')
          }
          await page.render({ canvasContext: ctx, viewport: vp }).promise
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('导出失败'))), format, format === 'image/jpeg' ? 0.92 : undefined)
          })
          const url = URL.createObjectURL(blob)
          next.push({ url, name: `page-${i}.${ext}` })
        }
        setPages(next)
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'PDF 处理失败')
      } finally {
        setBusy(false)
      }
    },
    [format],
  )

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        在浏览器中按页打开 PDF 并导出为图片。页数多或清晰度较高时可能较慢或占用较多内存。
      </p>
      <label className={toolLabelClass}>
        输出格式
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/png')}
          className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
        </select>
      </label>
      <label className={toolLabelClass}>
        选择 PDF
        <input
          type="file"
          accept="application/pdf"
          disabled={busy}
          className="mt-1 block text-sm"
          onChange={(e) => void onPdf(e.target.files?.[0] ?? null)}
        />
      </label>
      {busy && <p className="text-sm text-slate-600">渲染中…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {pages.length > 0 && (
        <ul className="mt-4 space-y-3">
          {pages.map((p) => (
            <li key={p.name} className="flex flex-wrap items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="max-h-32 max-w-full rounded border border-slate-200 bg-white" />
              <a
                href={p.url}
                download={p.name}
                className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
              >
                下载 {p.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
