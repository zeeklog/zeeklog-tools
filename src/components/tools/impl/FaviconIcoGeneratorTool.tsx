'use client'

import { useCallback, useState } from 'react'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function FaviconIcoGeneratorTool() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const run = useCallback(async () => {
    if (!file) {
      setErr('请选择图片')
      return
    }
    setErr('')
    setBusy(true)
    setBlobUrl((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    try {
      const fd = new FormData()
      fd.set('file', file)
      fd.set('targetFormat', 'ico')
      const res = await fetch('/api/tools/image/convert', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        setErr(j.error ?? '生成失败')
        return
      }
      const blob = await res.blob()
      setBlobUrl(URL.createObjectURL(blob))
    } catch {
      setErr('网络异常')
    } finally {
      setBusy(false)
    }
  }, [file])

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        将任意比例图片居中裁切为 256×256 后生成多尺寸 ICO，适用于浏览器标签页图标。
      </p>
      <label className={toolLabelClass}>
        源图（建议方形，支持 PNG/JPEG/WebP 等）
        <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <button
        type="button"
        disabled={!file || busy}
        onClick={() => void run()}
        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {busy ? '生成中…' : '生成 favicon.ico'}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {blobUrl && (
        <div className="mt-4">
          <a
            href={blobUrl}
            download="favicon.ico"
            className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            下载 favicon.ico
          </a>
        </div>
      )}
    </div>
  )
}
