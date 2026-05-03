'use client'

import { useMemo, useState } from 'react'
import JSZip from 'jszip'
import { removeWatermarkFromImage } from '@pilio/gemini-watermark-remover/browser'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_FILES = 10
const MAX_SINGLE_FILE_BYTES = 12 * 1024 * 1024
const MAX_BATCH_BYTES = 40 * 1024 * 1024
const MAX_SINGLE_IMAGE_PIXELS = 40_000_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 8
const RATE_LIMIT_STORAGE_KEY = 'tool:gemini-watermark-remover:runs'

type OutputItem = {
  id: string
  name: string
  sourceSize: number
  outputSize: number
  url: string
  blob: Blob
}

function buildOutputName(name: string): string {
  const idx = name.lastIndexOf('.')
  if (idx < 0) return `${name}-unwatermarked.png`
  return `${name.slice(0, idx)}-unwatermarked.png`
}

async function canvasToBlob(canvas: OffscreenCanvas | HTMLCanvasElement): Promise<Blob> {
  if ('convertToBlob' in canvas && typeof canvas.convertToBlob === 'function') {
    return canvas.convertToBlob({ type: 'image/png' })
  }
  return new Promise<Blob>((resolve, reject) => {
    ;(canvas as HTMLCanvasElement).toBlob((blob) => {
      if (!blob) {
        reject(new Error('导出处理结果失败'))
        return
      }
      resolve(blob)
    }, 'image/png')
  })
}

function checkLocalRateLimit(now: number): { allowed: boolean; retryAfterSec?: number } {
  if (typeof window === 'undefined') {
    return { allowed: true }
  }
  const raw = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY)
  let timestamps: number[] = []
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as number[]
      if (Array.isArray(parsed)) {
        timestamps = parsed.filter((value) => Number.isFinite(value))
      }
    } catch {
      timestamps = []
    }
  }
  const kept = timestamps.filter((t) => now - t <= RATE_LIMIT_WINDOW_MS)
  if (kept.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - kept[0])
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
  }
  kept.push(now)
  window.localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(kept))
  return { allowed: true }
}

export function GeminiWatermarkRemoverTool() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [outputs, setOutputs] = useState<OutputItem[]>([])

  const statsText = useMemo(() => {
    if (outputs.length === 0) return ''
    const totalInput = outputs.reduce((sum, item) => sum + item.sourceSize, 0)
    const totalOutput = outputs.reduce((sum, item) => sum + item.outputSize, 0)
    return `处理完成：${outputs.length} 张，输入 ${(totalInput / 1024 / 1024).toFixed(2)} MB，输出 ${(totalOutput / 1024 / 1024).toFixed(2)} MB`
  }, [outputs])

  const clearAll = () => {
    setOutputs((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url))
      return []
    })
    setError('')
  }

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    const limiter = checkLocalRateLimit(Date.now())
    if (!limiter.allowed) {
      setError(`操作过于频繁，请在 ${limiter.retryAfterSec ?? 1} 秒后重试。`)
      return
    }
    const selected = Array.from(files)
    if (selected.length > MAX_FILES) {
      setError(`最多同时处理 ${MAX_FILES} 张图片，请分批上传。`)
      return
    }
    const invalid = selected.find((file) => !ACCEPTED_TYPES.has(file.type))
    if (invalid) {
      setError('仅支持 JPG、PNG、WebP 图片。')
      return
    }
    if (selected.some((file) => file.size <= 0)) {
      setError('存在空文件，请重新选择图片。')
      return
    }
    const tooLarge = selected.find((file) => file.size > MAX_SINGLE_FILE_BYTES)
    if (tooLarge) {
      setError(`文件过大：${tooLarge.name} 超过 ${(MAX_SINGLE_FILE_BYTES / 1024 / 1024).toFixed(0)} MB 限制。`)
      return
    }
    const totalBytes = selected.reduce((sum, file) => sum + file.size, 0)
    if (totalBytes > MAX_BATCH_BYTES) {
      setError(`本次批量总大小超过 ${(MAX_BATCH_BYTES / 1024 / 1024).toFixed(0)} MB，请分批处理。`)
      return
    }

    setBusy(true)
    setOutputs((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url))
      return []
    })

    try {
      const next: OutputItem[] = []
      for (const file of selected) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const objectUrl = URL.createObjectURL(file)
          const image = new Image()
          image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
          }
          image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error(`无法解析图片：${file.name}`))
          }
          image.src = objectUrl
        })
        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) {
          throw new Error(`图片尺寸无效：${file.name}`)
        }
        if (img.naturalWidth * img.naturalHeight > MAX_SINGLE_IMAGE_PIXELS) {
          throw new Error(
            `图片像素过大：${file.name} 超过 ${(MAX_SINGLE_IMAGE_PIXELS / 1_000_000).toFixed(0)}MP，请先缩小后再处理。`,
          )
        }

        const { canvas } = await removeWatermarkFromImage(img)
        const blob = await canvasToBlob(canvas)
        const url = URL.createObjectURL(blob)
        next.push({
          id: `${file.name}-${file.lastModified}`,
          name: buildOutputName(file.name),
          sourceSize: file.size,
          outputSize: blob.size,
          url,
          blob,
        })
      }
      setOutputs(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : '去水印失败，请稍后重试。')
    } finally {
      setBusy(false)
    }
  }

  const downloadAll = async () => {
    if (outputs.length === 0) return
    const zip = new JSZip()
    outputs.forEach((item) => {
      zip.file(item.name, item.blob)
    })
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipUrl = URL.createObjectURL(zipBlob)
    const anchor = document.createElement('a')
    anchor.href = zipUrl
    anchor.download = 'gemini-watermark-removed.zip'
    anchor.click()
    URL.revokeObjectURL(zipUrl)
  }

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        上传 Gemini 或 Nano Banana 生成的图片后，即可在浏览器内执行去水印处理。支持 JPG、PNG、WebP，最多 10 张。
      </p>
      <p className="text-xs text-slate-500">为避免滥用，已启用频率限制与输入大小限制（单图 12MB、批量 40MB）。</p>
      <p className="text-xs text-slate-500">
        本功能使用开源工具实现：
        <a
          href="https://github.com/GargantuaX/gemini-watermark-remover"
          target="_blank"
          rel="noreferrer"
          className="ml-1 text-orange-700 underline underline-offset-2 hover:text-orange-800"
        >
          GargantuaX/gemini-watermark-remover
        </a>
      </p>

      <label className={toolLabelClass}>
        选择图片（最多 10 张）
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          disabled={busy}
          className="mt-1 block text-sm"
          onChange={(e) => void processFiles(e.target.files)}
        />
      </label>

      <div
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-600"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void processFiles(e.dataTransfer.files)
        }}
      >
        拖放图片到这里（JPG / PNG / WebP）
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void downloadAll()}
          disabled={busy || outputs.length === 0}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          全部下载
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={busy || outputs.length === 0}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          清空
        </button>
      </div>

      {busy && <p className="text-sm text-slate-600">处理中，请稍候…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {statsText && <p className="text-sm text-slate-700">{statsText}</p>}

      {outputs.length > 0 && (
        <ul className="space-y-3">
          {outputs.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm text-slate-700">{item.name}</p>
                <a
                  href={item.url}
                  download={item.name}
                  className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
                >
                  下载
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="max-h-72 max-w-full rounded border border-slate-200 bg-white" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
