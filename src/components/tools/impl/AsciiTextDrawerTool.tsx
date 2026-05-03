'use client'

import { useCallback, useEffect, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

/** 浏览器内不可使用包内相对路径 `./fonts`，需指向可访问的 CDN 目录（*.flf） */
const FIGLET_FONT_CDN_BASE = 'https://cdn.jsdelivr.net/npm/figlet@1.11.0/fonts'

const PRESET_FONTS = [
  'Standard',
  'Big',
  'Banner',
  'Block',
  'Bubble',
  'Digital',
  'Ghost',
  'Ivrit',
  'Mini',
  'Shadow',
  'Slant',
  'Small',
  'Speed',
] as const

type FigletModule = typeof import('figlet').default

let figletReady: FigletModule | null = null

async function ensureFiglet(): Promise<FigletModule> {
  if (figletReady) return figletReady
  const [figletMod, standardMod] = await Promise.all([
    import('figlet'),
    import('figlet/fonts/Standard'),
  ])
  const figlet = figletMod.default
  figlet.defaults({
    fontPath: FIGLET_FONT_CDN_BASE,
    fetchFontIfMissing: true,
    font: 'Standard',
  })
  figlet.parseFont('Standard', standardMod.default as string)
  figletReady = figlet
  return figlet
}

export function AsciiTextDrawerTool() {
  const [text, setText] = useState('HELLO')
  const [font, setFont] = useState<string>('Standard')
  const [customFont, setCustomFont] = useState('')
  const [useCustomFont, setUseCustomFont] = useState(false)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const resolvedFont = useCustomFont ? customFont.trim() || 'Standard' : font

  const run = useCallback(async () => {
    setErr('')
    setLoading(true)
    try {
      const figlet = await ensureFiglet()
      const ascii = await figlet.text(text, {
        font: resolvedFont,
        width: 120,
        whitespaceBreak: true,
      })
      setOut(ascii)
    } catch {
      setOut('')
      setErr('无法生成 ASCII 艺术字，请缩短文本、更换字体或稍后重试。')
    } finally {
      setLoading(false)
    }
  }, [text, resolvedFont])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const figlet = await ensureFiglet()
        if (cancelled) return
        const ascii = await figlet.text('HELLO', { font: 'Standard', width: 120, whitespaceBreak: true })
        if (!cancelled) setOut(ascii)
      } catch {
        if (!cancelled) {
          setErr('艺术字引擎加载失败，请刷新页面后重试。')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ToolShortcutArea run={() => void run()} canRun={!loading && text.trim() !== ''} className={toolSectionClass}>
      <div className="flex flex-wrap items-end gap-3">
        <label className={`${toolLabelClass} min-w-[160px] flex-1`}>
          文本
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            spellCheck={false}
          />
        </label>
        <label className={`${toolLabelClass} w-full sm:w-auto sm:min-w-[200px]`}>
          <span className="flex flex-wrap items-center gap-2">
            字体
            <button
              type="button"
              className="text-xs font-normal text-orange-700 underline-offset-2 hover:underline"
              onClick={() => setUseCustomFont((v) => !v)}
            >
              {useCustomFont ? '改用预设' : '自定义名称'}
            </button>
          </span>
          {useCustomFont ? (
            <input
              value={customFont}
              onChange={(e) => setCustomFont(e.target.value)}
              placeholder="与 figlet 字体名一致，如 Banner、Ghost"
              className="mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
              spellCheck={false}
            />
          ) : (
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              {PRESET_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading || text.trim() === ''}
          onClick={() => void run()}
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '生成中…' : '生成'}
        </button>
        <p className="flex flex-1 flex-wrap items-center text-xs text-slate-500">
          首次选用某预设字体会从 CDN 拉取字体文件（约数 KB）。Standard 已内置，可离线生成。
        </p>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <label className={toolLabelClass}>
        输出
        <pre className="mt-1.5 max-h-[28rem] overflow-auto whitespace-pre rounded-xl border border-slate-100 bg-slate-50/90 p-4 font-mono text-xs leading-snug text-slate-900">
          {out || '（点击下方「生成」）'}
        </pre>
      </label>
    </ToolShortcutArea>
  )
}
