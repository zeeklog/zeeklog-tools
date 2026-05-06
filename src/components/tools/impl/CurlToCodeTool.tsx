'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import type { ToolCodemirrorLang } from '@/components/tools/tool-codemirror-lang'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import {
  parseCurlCommand,
  parsedCurlToAxiosTs,
  parsedCurlToFetchJs,
  parsedCurlToPHP,
  parsedCurlToPythonRequests,
} from '@/lib/tools/logic/curl-to-code'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

type Tab = 'fetch' | 'axios' | 'php' | 'python'

const SAMPLE = `curl -X POST 'https://httpbin.org/post' \\
  -H 'Content-Type: application/json' \\
  -d '{"hello":"world"}'`

function tabToOutLang(tab: Tab): ToolCodemirrorLang {
  if (tab === 'fetch') return 'javascript'
  if (tab === 'axios') return 'typescript'
  return 'plaintext'
}

export function CurlToCodeTool() {
  const locale = useToolLocale()
  const [raw, setRaw] = useState(SAMPLE)
  const [tab, setTab] = useState<Tab>('fetch')
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)
  const limitMsg = assertInputWithinLimit(raw)

  const { out, err } = useMemo(() => {
    if (limitMsg) return { out: '', err: '' as string }
    const parsed = parseCurlCommand(raw)
    if (!parsed.ok) return { out: '', err: parsed.message }
    const p = parsed.data
    if (tab === 'fetch') return { out: parsedCurlToFetchJs(p), err: '' }
    if (tab === 'axios') return { out: parsedCurlToAxiosTs(p), err: '' }
    if (tab === 'php') return { out: parsedCurlToPHP(p), err: '' }
    return { out: parsedCurlToPythonRequests(p), err: '' }
  }, [raw, tab, limitMsg])

  const outLang = tabToOutLang(tab)

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">{locale === 'zh' ? 'curl 转代码' : 'curl to code'}</h2>
        <p className="mt-2">
          {locale === 'zh' ? (
            <>
              解析常见 <code className="rounded bg-white px-1 text-xs">curl</code> 片段：
              <code className="rounded bg-white px-1 text-xs">-X</code>、<code className="rounded bg-white px-1 text-xs">-H</code>、
              <code className="rounded bg-white px-1 text-xs">-d</code> / <code className="rounded bg-white px-1 text-xs">--data-raw</code>
              、URL 引号形式、<code className="rounded bg-white px-1 text-xs">-k</code>。复杂 cookie 文件、多 part 上传等需手工补全。
            </>
          ) : (
            <>
              Parses common <code className="rounded bg-white px-1 text-xs">curl</code> flags:
              <code className="rounded bg-white px-1 text-xs">-X</code>, <code className="rounded bg-white px-1 text-xs">-H</code>,
              <code className="rounded bg-white px-1 text-xs">-d</code> / <code className="rounded bg-white px-1 text-xs">--data-raw</code>,
              quoted URL formats, and <code className="rounded bg-white px-1 text-xs">-k</code>. Complex cookie files and multipart uploads may
              need manual adjustments.
            </>
          )}
        </p>
      </section>

      {limitMsg && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{limitMsg}</p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-800">
        {(
          [
            ['fetch', 'fetch (JavaScript)'],
            ['axios', 'axios (TypeScript)'],
            ['php', 'PHP cURL'],
            ['python', 'requests (Python)'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-lg border px-3 py-1.5 ${
              tab === k
                ? 'border-orange-400 bg-orange-50 text-orange-950'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            {locale === 'zh' ? 'curl 命令' : 'curl command'}
            <ToolCodeMirror value={raw} onChange={setRaw} rows={8} language="shell" variant="in" />
          </label>
          <label className={toolLabelClass}>
            {locale === 'zh' ? '生成代码' : 'Generated code'}
            <ToolCodeMirror ref={outRef} readOnly value={out} rows={14} language={outLang} variant="out" />
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(out)
              setHint(locale === 'zh' ? '已复制' : 'Copied')
              window.setTimeout(() => setHint(''), 2000)
            }}
            disabled={!out}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {locale === 'zh' ? '复制结果' : 'Copy output'}
          </button>
        </div>
      </ToolShortcutArea>

      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">{locale === 'zh' ? '相关工具' : 'Related tools'}</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/url-encoder"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              {locale === 'zh' ? 'URL 编码' : 'URL encode'}
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jwt-parser"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              {locale === 'zh' ? 'JWT 解析' : 'JWT parser'}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
