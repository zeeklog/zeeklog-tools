'use client'

import { useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

const TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT'] as const

export function DnsLookupTool() {
  const [hostname, setHostname] = useState('example.com')
  const [type, setType] = useState<(typeof TYPES)[number]>('A')
  const [loading, setLoading] = useState(false)
  const [out, setOut] = useState('')
  const [httpErr, setHttpErr] = useState('')

  const run = async () => {
    setLoading(true)
    setHttpErr('')
    setOut('')
    try {
      const u = new URL('/api/tools/dns-lookup', window.location.origin)
      u.searchParams.set('hostname', hostname.trim())
      u.searchParams.set('type', type)
      const res = await fetch(u.toString())
      const j = (await res.json()) as { error?: string; records?: unknown; detail?: string }
      if (!res.ok) {
        setHttpErr(j.error ?? `HTTP ${res.status}${j.detail ? `：${j.detail}` : ''}`)
        return
      }
      setOut(JSON.stringify(j, null, 2))
    } catch (e) {
      setHttpErr(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        经本站服务端转发 Node DNS 解析，带超时与显式错误。不保证绕过所有本地解析策略；滥用将由网关限流。
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <label className={toolLabelClass}>
          主机名
          <input value={hostname} onChange={(e) => setHostname(e.target.value)} className={toolInputClass} spellCheck={false} />
        </label>
        <label className={toolLabelClass}>
          记录类型
          <select value={type} onChange={(e) => setType(e.target.value as (typeof TYPES)[number])} className={toolInputClass}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={loading || !hostname.trim()}
          onClick={() => void run()}
          className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? '查询中…' : '查询'}
        </button>
      </div>
      {httpErr && <p className="text-sm text-red-600">{httpErr}</p>}
      <label className={toolLabelClass}>
        JSON 响应
        <ToolCodeMirror readOnly value={out} rows={12} language="json" variant="out" />
      </label>
    </div>
  )
}
