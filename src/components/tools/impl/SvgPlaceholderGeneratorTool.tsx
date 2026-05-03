'use client'

import { useMemo, useState } from 'react'
import { textToBase64 } from '@/lib/tools/logic/base64-convert'

export function SvgPlaceholderGeneratorTool() {
  const [w, setW] = useState(600)
  const [h, setH] = useState(350)
  const [fontSize, setFontSize] = useState(26)
  const [bg, setBg] = useState('#cccccc')
  const [fg, setFg] = useState('#333333')
  const [custom, setCustom] = useState('')
  const [exact, setExact] = useState(true)

  const svg = useMemo(() => {
    const text = custom.trim() || `${w}x${h}`
    const sizeAttr = exact ? ` width="${w}" height="${h}"` : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${sizeAttr}>
  <rect width="${w}" height="${h}" fill="${bg}"></rect>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize}px" fill="${fg}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
</svg>`.trim()
  }, [w, h, fontSize, bg, fg, custom, exact])

  const dataUrl = useMemo(() => `data:image/svg+xml;base64,${textToBase64(svg)}`, [svg])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          宽
          <input type="number" min={1} value={w} onChange={(e) => setW(Number(e.target.value))} className="ml-2 w-24 rounded border px-2 py-1" />
        </label>
        <label className="text-sm">
          高
          <input type="number" min={1} value={h} onChange={(e) => setH(Number(e.target.value))} className="ml-2 w-24 rounded border px-2 py-1" />
        </label>
        <label className="text-sm">
          字号
          <input type="number" min={1} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="ml-2 w-20 rounded border px-2 py-1" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={exact} onChange={(e) => setExact(e.target.checked)} />
          固定 width/height 属性
        </label>
        <label className="text-sm">
          背景
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="ml-2 h-8 w-14" />
        </label>
        <label className="text-sm">
          文字色
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="ml-2 h-8 w-14" />
        </label>
      </div>
      <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`默认文案 ${w}x${h}`} className="w-full rounded border px-2 py-1 text-sm" />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void navigator.clipboard.writeText(svg)} className="rounded border px-3 py-1 text-sm">
          复制 SVG
        </button>
        <button type="button" onClick={() => void navigator.clipboard.writeText(dataUrl)} className="rounded border px-3 py-1 text-sm">
          复制 Data URL
        </button>
        <a href={dataUrl} download="placeholder.svg" className="rounded bg-orange-500 px-3 py-1 text-sm text-white">
          下载 SVG
        </a>
      </div>
      <pre className="max-h-40 overflow-auto rounded bg-gray-50 p-2 font-mono text-xs">{svg}</pre>
    </div>
  )
}
