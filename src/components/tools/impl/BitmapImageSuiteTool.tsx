'use client'

import { useCallback, useEffect, useState } from 'react'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export type BitmapImageSuiteMode =
  | 'jpg-png'
  | 'png-jpg'
  | 'gif-png'
  | 'png-gif'
  | 'bmp-png'
  | 'bmp-jpg'
  | 'rounded'

type Mode = BitmapImageSuiteMode

function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法解码图像'))
    }
    img.src = url
  })
}

function canvasToDataUrl(canvas: HTMLCanvasElement, mime: 'image/png' | 'image/jpeg', q?: number): string {
  return mime === 'image/jpeg' ? canvas.toDataURL(mime, q ?? 0.88) : canvas.toDataURL(mime)
}

export type BitmapImageSuiteToolProps = {
  initialMode?: BitmapImageSuiteMode
}

export function BitmapImageSuiteTool({ initialMode = 'jpg-png' }: BitmapImageSuiteToolProps = {}) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [file, setFile] = useState<File | null>(null)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [radius, setRadius] = useState(24)

  const run = useCallback(async () => {
    if (!file) {
      setOut('')
      return
    }
    setErr('')
    try {
      if (mode === 'png-gif') {
        const fd = new FormData()
        fd.set('file', file)
        fd.set('targetFormat', 'gif')
        const res = await fetch('/api/tools/image/convert', { method: 'POST', body: fd })
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(j.error ?? '转换未成功，请稍后重试')
        }
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setOut(url)
        return
      }

      const img = await loadImageFile(file)
      const w = img.naturalWidth
      const h = img.naturalHeight
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) {
        setErr('Canvas 不可用')
        return
      }

      if (mode === 'rounded') {
        const r = Math.min(radius, Math.floor(Math.min(w, h) / 2))
        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, w, h, r)
        } else {
          const rr = r
          ctx.moveTo(rr, 0)
          ctx.lineTo(w - rr, 0)
          ctx.quadraticCurveTo(w, 0, w, rr)
          ctx.lineTo(w, h - rr)
          ctx.quadraticCurveTo(w, h, w - rr, h)
          ctx.lineTo(rr, h)
          ctx.quadraticCurveTo(0, h, 0, h - rr)
          ctx.lineTo(0, rr)
          ctx.quadraticCurveTo(0, 0, rr, 0)
          ctx.closePath()
        }
        ctx.clip()
        ctx.drawImage(img, 0, 0)
        ctx.restore()
        setOut(canvasToDataUrl(c, 'image/png'))
        return
      }

      ctx.drawImage(img, 0, 0)
      if (mode === 'jpg-png' || mode === 'gif-png' || mode === 'bmp-png') {
        setOut(canvasToDataUrl(c, 'image/png'))
        return
      }
      if (mode === 'png-jpg' || mode === 'bmp-jpg') {
        setOut(canvasToDataUrl(c, 'image/jpeg', 0.88))
        return
      }
      setOut('')
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
      setOut('')
    }
  }, [file, mode, radius])

  useEffect(() => {
    void run()
  }, [run])

  useEffect(() => {
    return () => {
      if (out && out.startsWith('blob:')) {
        URL.revokeObjectURL(out)
      }
    }
  }, [out])

  const ext =
    mode === 'png-jpg' || mode === 'bmp-jpg'
      ? 'jpg'
      : mode === 'png-gif'
        ? 'gif'
        : 'png'

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        在您的设备上完成预览与导出；个别格式由在线转换完成。大图请注意内存占用。
      </p>
      <label className={toolLabelClass}>
        模式
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="mt-1 block w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="jpg-png">JPG → PNG</option>
          <option value="png-jpg">PNG → JPG</option>
          <option value="gif-png">GIF → PNG（首帧）</option>
          <option value="png-gif">PNG → GIF（单帧）</option>
          <option value="bmp-png">BMP → PNG</option>
          <option value="bmp-jpg">BMP → JPG</option>
          <option value="rounded">圆角 PNG</option>
        </select>
      </label>
      {mode === 'rounded' && (
        <label className={toolLabelClass}>
          圆角半径（像素）
          <input
            type="number"
            min={0}
            max={500}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value) || 0)}
            className="mt-1 w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      )}
      <label className={toolLabelClass}>
        选择图片
        <input
          type="file"
          accept="image/*"
          className="mt-1 block text-sm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {out && (
        <div className="mt-4 space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="out" className="max-h-64 max-w-full rounded border border-slate-200 bg-white" />
          <a
            href={out}
            download={`out.${ext}`}
            className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            下载
          </a>
        </div>
      )}
    </div>
  )
}
