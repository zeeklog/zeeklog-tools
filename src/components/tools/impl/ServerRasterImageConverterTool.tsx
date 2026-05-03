'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  SERVER_IMAGE_TARGET_FORMATS,
  type ServerImageTargetFormat,
} from '@/lib/tools/image-server-limits'

/** 超过此大小的图片在转换流程中提示上传可能较慢（与产品文案一致：2 MB） */
const LARGE_IMAGE_BYTES = 2 * 1024 * 1024

function formatFileSizeMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type RunProgressUi = { kind: 'idle' } | { kind: 'upload'; percent: number | null } | { kind: 'convert' }

export type ServerRasterImageConverterToolProps = {
  initialTargetFormat?: ServerImageTargetFormat
  matrixFromLabel?: string
  matrixToLabel?: string
  showMatrixFallbackBanner?: boolean
}

export function ServerRasterImageConverterTool({
  initialTargetFormat = 'png',
  matrixFromLabel,
  matrixToLabel,
  showMatrixFallbackBanner,
}: ServerRasterImageConverterToolProps = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState<ServerImageTargetFormat>(initialTargetFormat)
  const [resize, setResize] = useState(100)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [runProgress, setRunProgress] = useState<RunProgressUi>({ kind: 'idle' })
  const [dragging, setDragging] = useState(false)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      xhrRef.current?.abort()
    }
  }, [])

  const run = useCallback(async () => {
    if (!file) {
      setErr('请选择图片文件')
      return
    }
    setErr('')
    setBusy(true)
    setRunProgress({ kind: 'upload', percent: 0 })
    setPreviewUrl((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    const fd = new FormData()
    fd.set('file', file)
    fd.set('targetFormat', target)
    if (resize !== 100) {
      fd.set('resizePercent', String(resize))
    }

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr

    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        xhr.open('POST', '/api/tools/image/convert')
        xhr.responseType = 'blob'
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            setRunProgress({
              kind: 'upload',
              percent: Math.min(100, Math.round((100 * e.loaded) / e.total)),
            })
          } else {
            setRunProgress({ kind: 'upload', percent: null })
          }
        }
        xhr.upload.onload = () => {
          setRunProgress({ kind: 'convert' })
        }
        xhr.onload = () => {
          resolve(xhr.response as Blob)
        }
        xhr.onerror = () => {
          reject(new Error('network'))
        }
        xhr.onabort = () => {
          reject(new Error('abort'))
        }
        xhr.send(fd)
      })

      if (xhr.status < 200 || xhr.status >= 300) {
        let msg = '转换失败，请稍后重试'
        try {
          const t = await blob.text()
          const j = JSON.parse(t) as { error?: string }
          if (j.error) msg = j.error
        } catch {
          /* ignore */
        }
        setErr(msg)
        return
      }
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (e) {
      if (e instanceof Error && e.message === 'abort') {
        return
      }
      setErr('网络异常，请稍后重试')
    } finally {
      xhrRef.current = null
      setBusy(false)
      setRunProgress({ kind: 'idle' })
    }
  }, [file, target, resize])

  const downloadName = `output.${target === 'jpeg' ? 'jpg' : target === 'ico' ? 'ico' : target}`

  const busyLabel =
    runProgress.kind === 'upload'
      ? '上传中…'
      : runProgress.kind === 'convert'
        ? '转换中…'
        : '处理中…'

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onPickFile = useCallback((nextFile: File | null) => {
    setFile(nextFile)
    setErr('')
    setPreviewUrl((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setDragging(false)
      const dropped = e.dataTransfer.files?.[0] ?? null
      if (!dropped) return
      if (!dropped.type.startsWith('image/')) {
        setErr('仅支持图片文件，请重新选择')
        return
      }
      onPickFile(dropped)
    },
    [onPickFile]
  )

  return (
    <div className={toolSectionClass}>
      {matrixFromLabel && matrixToLabel && (
        <p className="mb-2 text-xs text-slate-500">
          本页入口：{matrixFromLabel} → {matrixToLabel}
          {showMatrixFallbackBanner ? '（部分目标会先输出为便于预览、下载的通用图片）' : ''}
        </p>
      )}
      <p className="text-sm text-slate-600">
        上传图片后选择目标格式即可转换并下载；支持常见图片与图标输出。文件不会在服务器长期保存，单张约 20MB 上限。
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-orange-50/60 to-white p-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              if (!dragging) setDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setDragging(false)
            }}
            onDrop={onDrop}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
              dragging
                ? 'border-orange-500 bg-orange-50 text-orange-900'
                : 'border-slate-300 bg-white text-slate-700 hover:border-orange-400 hover:bg-orange-50/50'
            }`}
          >
            <span className="text-base font-semibold">拖放图片到这里</span>
            <span className="text-sm text-slate-500">或点击选择图片（支持 PNG/JPG/WebP/GIF/BMP 等）</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
          <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            {file ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium text-slate-900">{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
                <span>{file.type || '未知类型'}</span>
              </div>
            ) : (
              <span>尚未选择文件</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className={toolLabelClass}>
            目标格式
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as ServerImageTargetFormat)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {SERVER_IMAGE_TARGET_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className={toolLabelClass}>
            缩放比例（100 为原始大小）
            <input
              type="number"
              min={1}
              max={200}
              value={resize}
              onChange={(e) => setResize(Number(e.target.value) || 100)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={!file || busy}
            onClick={() => void run()}
            className="mt-2 w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? busyLabel : '开始转换'}
          </button>
        </div>
      </div>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      {busy && file && (
        <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          {file.size > LARGE_IMAGE_BYTES && (
            <p className="text-sm leading-relaxed text-amber-950">
              <span className="font-medium">大文件提示：</span>
              当前图片约 {formatFileSizeMb(file.size)} MB（已超过 2 MB），上传到服务器所需时间会更长，具体取决于你的网络。进度条仅代表上传进度；上传结束后还会在服务端完成格式转换，请保持本页打开、勿关闭或刷新。
            </p>
          )}
          {runProgress.kind === 'upload' && (
            <>
              <p className="text-xs text-slate-600">
                {runProgress.percent != null
                  ? `正在上传图片到服务器… ${runProgress.percent}%`
                  : '正在上传图片到服务器…（浏览器未提供总大小，暂无法显示百分比）'}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                {runProgress.percent != null ? (
                  <div
                    className="h-full rounded-full bg-orange-500 transition-[width] duration-150 ease-out"
                    style={{ width: `${runProgress.percent}%` }}
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 opacity-90 animate-pulse" />
                )}
              </div>
            </>
          )}
          {runProgress.kind === 'convert' && (
            <p className="text-xs text-slate-600">上传已完成，正在服务端转换格式，请稍候…</p>
          )}
        </div>
      )}
      {previewUrl && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">结果预览</p>
            <a
              href={previewUrl}
              download={downloadName}
              className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              下载文件
            </a>
          </div>
          {target === 'ico' || target === 'jpeg' || target === 'png' || target === 'gif' || target === 'webp' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="result" className="max-h-80 max-w-full rounded-xl border border-slate-200" />
          ) : (
            <p className="text-sm text-slate-600">当前格式可能无法在页面内预览，请直接下载。</p>
          )}
        </div>
      )}
    </div>
  )
}
