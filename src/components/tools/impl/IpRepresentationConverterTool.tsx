'use client'

import { useMemo, useState } from 'react'
import { toolInputClass, toolLabelClass, toolSectionClass, toolInputReadonlyClass } from '@/components/tools/tool-field-classes'
import { summarizeIpv4Representations } from '@/lib/tools/logic/ip-representation'

export function IpRepresentationConverterTool() {
  const [ip, setIp] = useState('192.168.0.1')
  const summary = useMemo(() => summarizeIpv4Representations(ip), [ip])

  if ('error' in summary) {
    return (
      <div className={toolSectionClass}>
        <label className={toolLabelClass}>
          IPv4
          <input value={ip} onChange={(e) => setIp(e.target.value)} className={toolInputClass} spellCheck={false} />
        </label>
        <p className="text-sm text-red-600">{summary.error}</p>
      </div>
    )
  }

  const rows: [string, string][] = [
    ['点分十进制', summary.dotted],
    ['32 位无符号整数', String(summary.decimal)],
    ['32 位二进制', summary.binary32],
    ['点分十六进制', summary.hexDotted],
    ['点分八进制', summary.octalDotted],
  ]

  return (
    <div className={toolSectionClass}>
      <label className={toolLabelClass}>
        IPv4
        <input value={ip} onChange={(e) => setIp(e.target.value)} className={toolInputClass} spellCheck={false} />
      </label>
      <dl className="mt-4 space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <dt className="w-40 shrink-0 text-sm text-slate-600">{k}</dt>
            <dd className="min-w-0 flex-1">
              <input readOnly value={v} className={toolInputReadonlyClass} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
