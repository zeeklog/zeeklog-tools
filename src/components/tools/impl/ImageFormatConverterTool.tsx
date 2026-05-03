'use client'

import { useCallback, useEffect, useState } from 'react'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function ImageFormatConverterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [mime, setMime] = useState<'image/png' | 'image/jpeg'>('image/png')
  const [dataUrl, setDataUrl] = useState('')
  const [err, setErr] = useState('')

  const run = useCallback(() => {
    if (!file) {
      setDataUrl('')
      return
    }
    setErr('')
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')
        if (!ctx) {
          setErr('Canvas 不可用')
          return
        }
        ctx.drawImage(img, 0, 0)
        const q = mime === 'image/jpeg' ? 0.88 : undefined
        setDataUrl(c.toDataURL(mime, q))
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e))
        setDataUrl('')
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      setErr('无法解码图像')
      setDataUrl('')
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [file, mime])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">在浏览器中重新编码（不同格式压缩方式不同）。大图请谨慎，可能占用较多内存。</p>
      <label className={toolLabelClass}>
        选择图片
        <input
          type="file"
          accept="image/*"
          className="mt-1 block text-sm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <label className={toolLabelClass}>
        输出格式
        <select value={mime} onChange={(e) => setMime(e.target.value as 'image/png' | 'image/jpeg')} className="mt-1 rounded-lg border px-3 py-2 text-sm">
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
        </select>
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {dataUrl && (
        <div className="space-y-2">
          <p className="text-sm text-slate-700">预览</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="preview" className="max-h-64 max-w-full rounded border border-slate-200" />
          <a
            href={dataUrl}
            download={`converted.${mime === 'image/png' ? 'png' : 'jpg'}`}
            className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            下载
          </a>
        </div>
      )}
    </div>
  )
}
