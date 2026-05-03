'use client'

import { Copy, FileDown, GripVertical, Loader2, RotateCcw, Sparkles, Wand2, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToolRunShortcutHint } from '@/components/tools/ToolRunShortcutHint'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { useIsApplePlatform } from '@/lib/tools/use-is-apple-platform'
import { assertInputWithinLimit, TOOL_MAX_INPUT_CHARS } from '@/lib/tools/runtime-limits'

type ProcessMode = 'compress' | 'mangle' | 'obfuscate'

const SAMPLE_JS = `function greet(user) {
  const message = "Hello, " + user.name + "!";
  console.log(message);
  return message;
}

greet({ name: "World" });
`

const SPLIT_STORAGE_KEY = 'tool:javascript-compress:leftPct'
const SPLIT_MIN = 22
const SPLIT_MAX = 78
const SPLIT_DEFAULT = 50

const MODE_OPTIONS: {
  id: ProcessMode
  label: string
  short: string
  description: string
  icon: typeof Zap
  accent: string
}[] = [
  {
    id: 'compress',
    label: '标准压缩',
    short: '压缩',
    description: '删除注释与多余空白，保留变量名，体积最小化风险低。',
    icon: Zap,
    accent: 'border-slate-200 bg-slate-50 text-slate-800',
  },
  {
    id: 'mangle',
    label: '压缩 + 混淆变量名',
    short: 'Terser',
    description: '在压缩基础上缩短局部变量名，适合发布前端 bundle。',
    icon: Wand2,
    accent: 'border-orange-200 bg-orange-50 text-orange-950',
  },
  {
    id: 'obfuscate',
    label: '高强度混淆',
    short: 'Obfuscator',
    description: '字符串数组等变换，体积会明显增大，仅建议在确有需要时使用。',
    icon: Sparkles,
    accent: 'border-amber-300 bg-amber-50 text-amber-950',
  },
]

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function clampSplit(n: number) {
  return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, n))
}

export function JavascriptCompressTool() {
  const [mode, setMode] = useState<ProcessMode>('compress')
  const [input, setInput] = useState(SAMPLE_JS)
  const [output, setOutput] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastMode, setLastMode] = useState<ProcessMode | null>(null)
  const [actionHint, setActionHint] = useState('')

  const [isLg, setIsLg] = useState(false)
  const [leftPct, setLeftPct] = useState(SPLIT_DEFAULT)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startPct: number } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const apply = () => setIsLg(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SPLIT_STORAGE_KEY)
      if (raw == null) return
      const n = Number(raw)
      if (Number.isFinite(n)) setLeftPct(clampSplit(n))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!isLg) return
    try {
      localStorage.setItem(SPLIT_STORAGE_KEY, String(Math.round(leftPct)))
    } catch {
      /* ignore */
    }
  }, [isLg, leftPct])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current
      const el = containerRef.current
      if (!drag || !el) return
      const w = el.getBoundingClientRect().width
      if (w <= 0) return
      const dx = e.clientX - drag.startX
      const deltaPct = (dx / w) * 100
      setLeftPct(clampSplit(drag.startPct + deltaPct))
    }
    const onUp = () => {
      dragRef.current = null
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const onDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startPct: leftPct }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const inputLen = input.length
  const limitRatio = inputLen / TOOL_MAX_INPUT_CHARS
  const nearLimit = limitRatio >= 0.85
  const overLimit = inputLen > TOOL_MAX_INPUT_CHARS

  const stats = useMemo(() => {
    if (!output || !input) return null
    const ratio = inputLen > 0 ? (output.length / inputLen) * 100 : 0
    return {
      in: inputLen,
      out: output.length,
      delta: output.length - inputLen,
      ratioPct: ratio.toFixed(1),
    }
  }, [inputLen, output, input])

  const run = useCallback(async () => {
    setErr('')
    setActionHint('')
    const limitMsg = assertInputWithinLimit(input)
    if (limitMsg) {
      setErr(limitMsg)
      setOutput('')
      setLastMode(null)
      return
    }
    if (input.trim() === '') {
      setErr('请先粘贴或输入 JavaScript 源码。')
      setOutput('')
      setLastMode(null)
      return
    }

    setLoading(true)
    setOutput('')
    setLastMode(null)
    try {
      if (mode === 'compress' || mode === 'mangle') {
        const { minify } = await import('terser')
        const r = (await minify(input, {
          compress: true,
          mangle: mode === 'mangle',
          format: { comments: false },
        })) as { code?: string; error?: unknown }
        if (r.error != null) {
          setErr(String(r.error))
          return
        }
        setOutput(r.code ?? '')
        setLastMode(mode)
      } else {
        const { default: JavaScriptObfuscator } = await import('javascript-obfuscator')
        const r = JavaScriptObfuscator.obfuscate(input, {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          stringArray: true,
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
        })
        setOutput(r.getObfuscatedCode())
        setLastMode('obfuscate')
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : '处理失败')
    } finally {
      setLoading(false)
    }
  }, [input, mode])

  const canRun = !loading && !overLimit && input.trim() !== ''
  const apple = useIsApplePlatform()

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setActionHint('已复制到剪贴板')
    window.setTimeout(() => setActionHint(''), 2500)
  }

  const resetAll = () => {
    setInput('')
    setOutput('')
    setErr('')
    setLastMode(null)
    setActionHint('')
  }

  const loadSample = () => {
    setInput(SAMPLE_JS)
    setErr('')
    setActionHint('已填入示例代码')
    window.setTimeout(() => setActionHint(''), 2000)
  }

  const activeMeta = MODE_OPTIONS.find((m) => m.id === mode)!

  const inputPanel = (
    <div className="flex min-h-0 min-w-0 flex-col space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-800">源码</span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={nearLimit || overLimit ? 'font-medium text-amber-800' : 'text-gray-500'}>
            {inputLen.toLocaleString('zh-CN')} / {TOOL_MAX_INPUT_CHARS.toLocaleString('zh-CN')} 字符
          </span>
          <button
            type="button"
            onClick={loadSample}
            className="rounded-md px-2 py-1 text-orange-700 hover:bg-orange-100"
          >
            示例
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            清空
          </button>
        </div>
      </div>
      <div className={overLimit ? 'rounded-xl ring-2 ring-amber-400/40' : ''}>
        <ToolCodeMirror
          value={input}
          onChange={setInput}
          rows={14}
          language="javascript"
          variant="in"
          className="min-h-[220px]"
          basicSetup={{ lineNumbers: true, foldGutter: true }}
        />
      </div>
    </div>
  )

  const outputPanel = (
    <div className="flex min-h-0 min-w-0 flex-col space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-800">结果</span>
        {stats && lastMode && (
          <span className="text-xs text-gray-500">
            约 <strong className="text-gray-800">{stats.ratioPct}%</strong> 相对输入
            {stats.delta !== 0 && (
              <span className={stats.delta > 0 ? ' text-amber-700' : ' text-emerald-700'}>
                （{stats.delta > 0 ? '+' : ''}
                {stats.delta.toLocaleString('zh-CN')} 字符）
              </span>
            )}
          </span>
        )}
      </div>
      <div className="relative min-h-[220px] flex-1">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/85 backdrop-blur-[1px]"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" aria-hidden />
            <span className="text-sm text-gray-600">正在{activeMeta.label}…</span>
          </div>
        )}
        <ToolCodeMirror
          readOnly
          value={output}
          rows={14}
          language="javascript"
          variant="out"
          className="min-h-[220px]"
          placeholder="点击「执行」后在此查看输出；焦点在结果区时也可用快捷键再次执行"
          basicSetup={{ lineNumbers: true, foldGutter: true }}
        />
      </div>
    </div>
  )

  const splitHint = (
    <p className="hidden text-center text-[11px] text-gray-400 lg:block">
      桌面端可拖拽中间竖条调整源码与结果区域宽度（比例已记住在本机）
    </p>
  )

  return (
    <ToolShortcutArea
      className="space-y-6"
      showShortcutHint={false}
      run={() => void run()}
      canRun={canRun}
    >
      {/* 模式 */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">处理方式</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const selected = mode === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setMode(opt.id)
                  setErr('')
                }}
                className={`flex flex-col rounded-xl border-2 p-3 text-left transition ${
                  selected
                    ? 'border-orange-500 bg-orange-50/80 shadow-sm ring-1 ring-orange-200'
                    : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                }`}
              >
                <span className="flex items-center gap-2 font-medium text-gray-900">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${opt.accent} ${selected ? 'ring-2 ring-orange-300/60' : ''}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {opt.label}
                </span>
                <span className="mt-2 text-xs leading-relaxed text-gray-600">{opt.description}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* 双栏：小屏纵向；大屏可拖拽比例 */}
      {!isLg ? (
        <div className="flex flex-col gap-6">
          {inputPanel}
          {outputPanel}
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="flex min-h-[280px] flex-row items-stretch gap-0"
            style={{ touchAction: 'none' }}
          >
            <div className="min-w-0 shrink-0" style={{ flex: `0 0 ${leftPct}%` }}>
              {inputPanel}
            </div>
            <button
              type="button"
              role="separator"
              aria-orientation="vertical"
              aria-label="拖拽调整源码与结果区域宽度"
              aria-valuemin={SPLIT_MIN}
              aria-valuemax={SPLIT_MAX}
              aria-valuenow={Math.round(leftPct)}
              onMouseDown={onDividerMouseDown}
              className="group mx-1 flex w-3 shrink-0 cursor-col-resize items-stretch justify-center rounded-md border-0 bg-transparent px-0 py-0 hover:bg-orange-100/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <span className="my-4 flex w-1.5 items-center justify-center rounded-full bg-gray-200 transition group-hover:bg-orange-400 group-active:bg-orange-500">
                <GripVertical className="h-5 w-5 text-gray-500 opacity-70 group-hover:text-orange-900" aria-hidden />
              </span>
            </button>
            <div className="min-w-0 flex-1">{outputPanel}</div>
          </div>
          {splitHint}
        </>
      )}

      {/* 主操作条 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={!canRun}
          title={apple ? '快捷键：⌘+Enter' : '快捷键：Ctrl+Enter'}
          onClick={() => void run()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              处理中…
            </>
          ) : (
            <>执行：{activeMeta.label}</>
          )}
        </button>
        <div className="flex flex-col gap-1 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              disabled={!output || loading}
              onClick={() => void copyOutput()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:border-orange-200 hover:bg-orange-50 disabled:opacity-40"
            >
              <Copy className="h-4 w-4" aria-hidden />
              复制结果
            </button>
            <button
              type="button"
              disabled={!output || loading}
              onClick={() => downloadText(`output-${mode}.js`, output)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:border-orange-200 hover:bg-orange-50 disabled:opacity-40"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              下载 .js
            </button>
          </div>
          <ToolRunShortcutHint className="text-center sm:text-right" />
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {err}
        </div>
      )}

      {actionHint && !err && (
        <p className="text-center text-sm text-emerald-700" role="status">
          {actionHint}
        </p>
      )}

      <details className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 text-xs text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-700">运行说明与限制</summary>
        <p className="mt-2 leading-relaxed">
          在浏览器<strong>主线程</strong>内执行（非独立沙箱进程）；恶意或极大脚本可能导致标签页卡顿。已限制输入约{' '}
          {TOOL_MAX_INPUT_CHARS.toLocaleString('zh-CN')} 字符。高强度混淆会显著增大体积；请勿在页面内粘贴生产密钥。
        </p>
      </details>
    </ToolShortcutArea>
  )
}
