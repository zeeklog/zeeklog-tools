'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'

type MermaidAPI = typeof import('mermaid').default

const DEFAULT_MERMAID = `flowchart TD
    A[开始] --> B{是否已登录}
    B -->|是| C[进入控制台]
    B -->|否| D[打开登录弹窗]
    D --> E[完成登录]
    E --> C
`

const SEQUENCE_SAMPLE = `sequenceDiagram
    participant U as User
    participant W as Web
    participant A as API
    U->>W: 提交请求
    W->>A: 调用接口
    A-->>W: 返回结果
    W-->>U: 渲染页面
`

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function getSvgSize(svgElement: SVGSVGElement): { width: number; height: number } {
  const widthAttr = Number(svgElement.getAttribute('width') ?? 0)
  const heightAttr = Number(svgElement.getAttribute('height') ?? 0)
  if (widthAttr > 0 && heightAttr > 0) {
    return { width: widthAttr, height: heightAttr }
  }
  const viewBox = svgElement.viewBox?.baseVal
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height }
  }
  return { width: 1200, height: 800 }
}

export function MermaidPreviewTool() {
  const [source, setSource] = useState(DEFAULT_MERMAID)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [pngPreviewUrl, setPngPreviewUrl] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [isWorkspaceFullscreen, setIsWorkspaceFullscreen] = useState(false)
  const [mermaidApi, setMermaidApi] = useState<MermaidAPI | null>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    import('mermaid')
      .then((m) => {
        if (cancelled) return
        const api = m.default
        api.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'default',
          suppressErrorRendering: true,
        })
        setMermaidApi(api)
      })
      .catch(() => {
        if (!cancelled) setError('图表引擎加载失败，请刷新页面重试。')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const code = source.trim()
    if (!code) {
      setSvg('')
      setError('')
      setPngPreviewUrl('')
      setExportError('')
      return
    }
    if (!mermaidApi) {
      setSvg('')
      setError('')
      return
    }

    const render = async () => {
      try {
        const id = `mermaid-preview-${Date.now()}`
        const { svg: rendered } = await mermaidApi.render(id, code)
        if (cancelled) return
        setSvg(rendered)
        setError('')
        setPngPreviewUrl('')
        setExportError('')
      } catch (e) {
        if (cancelled) return
        setSvg('')
        setPngPreviewUrl('')
        const message = e instanceof Error ? e.message : '图表语法有误，请检查后重试。'
        setError(message || '图表语法有误，请检查后重试。')
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [source, mermaidApi])

  useEffect(() => {
    return () => {
      if (pngPreviewUrl) URL.revokeObjectURL(pngPreviewUrl)
    }
  }, [pngPreviewUrl])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsWorkspaceFullscreen(document.fullscreenElement === workspaceRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  async function buildPngDataUrl(): Promise<string> {
    if (!svg) throw new Error('请先生成 Mermaid 预览。')
    const parser = new DOMParser()
    const doc = parser.parseFromString(svg, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')
    if (!svgElement) throw new Error('SVG 内容无效，无法导出。')
    const { width, height } = getSvgSize(svgElement)

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const objectUrl = URL.createObjectURL(svgBlob)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('图片生成失败，请稍后重试。'))
        img.src = objectUrl
      })

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width))
      canvas.height = Math.max(1, Math.round(height))
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('浏览器不支持 Canvas 导出。')

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/png')
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  function handleDownloadSvg() {
    if (!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    triggerDownload(url, 'mermaid-diagram.svg')
    URL.revokeObjectURL(url)
  }

  async function handleGeneratePngPreview() {
    try {
      setExporting(true)
      setExportError('')
      const dataUrl = await buildPngDataUrl()
      if (pngPreviewUrl) URL.revokeObjectURL(pngPreviewUrl)
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      setPngPreviewUrl(objectUrl)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'PNG 生成失败，请检查图表后重试。'
      setExportError(message)
    } finally {
      setExporting(false)
    }
  }

  async function handleDownloadPng() {
    try {
      setExporting(true)
      setExportError('')
      const dataUrl = await buildPngDataUrl()
      triggerDownload(dataUrl, 'mermaid-diagram.png')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'PNG 下载失败，请检查图表后重试。'
      setExportError(message)
    } finally {
      setExporting(false)
    }
  }

  async function toggleWorkspaceFullscreen() {
    try {
      const target = workspaceRef.current
      if (!target) return
      if (document.fullscreenElement === target) {
        await document.exitFullscreen()
        setIsWorkspaceFullscreen(false)
        return
      }
      await target.requestFullscreen()
      setIsWorkspaceFullscreen(true)
    } catch {
      setExportError('当前浏览器不支持全屏或全屏请求被拦截。')
    }
  }

  const lineCount = useMemo(() => source.split('\n').length, [source])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSource(DEFAULT_MERMAID)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          流程图示例
        </button>
        <button
          type="button"
          onClick={() => setSource(SEQUENCE_SAMPLE)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          时序图示例
        </button>
        <span className="text-xs text-gray-500">共 {lineCount} 行，编辑后自动预览</span>
      </div>

      <div ref={workspaceRef} className="bg-white p-2">
        <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-2 border-b bg-white/95 pb-2 backdrop-blur">
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!svg || !!error}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下载 SVG
          </button>
          <button
            type="button"
            onClick={handleGeneratePngPreview}
            disabled={!svg || !!error || exporting}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? '生成中...' : '生成 PNG 图片'}
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!svg || !!error || exporting}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下载 PNG
          </button>
          <button
            type="button"
            onClick={() => void toggleWorkspaceFullscreen()}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            {isWorkspaceFullscreen ? '退出全屏工作区' : '编辑+预览全屏'}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Mermaid 源码</p>
          </div>
          <div className="mt-1 [&_.cm-scroller]:min-h-[420px]">
            <ToolCodeMirror
              value={source}
              onChange={setSource}
              rows={22}
              language="markdown"
              variant="in"
              placeholder="在此输入 Mermaid 语法..."
            />
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">预览</p>
          </div>
          {error ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : null}
          {!mermaidApi ? <p className="text-sm text-gray-500">正在加载图表引擎…</p> : null}
          {mermaidApi && !error && !svg ? <p className="text-sm text-gray-500">请输入图表定义。</p> : null}
          {!error && svg ? <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
          {exportError ? <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-700">{exportError}</p> : null}
          {pngPreviewUrl ? (
            <div className="mt-3 border-t pt-3">
              <p className="mb-2 text-sm font-medium text-gray-700">PNG 图片预览</p>
              <img src={pngPreviewUrl} alt="Mermaid PNG 预览" className="max-h-[360px] w-full object-contain" />
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  )
}
