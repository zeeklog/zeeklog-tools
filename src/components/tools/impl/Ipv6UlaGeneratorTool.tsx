'use client'

import { SHA1 } from 'crypto-js'
import { useMemo, useState } from 'react'

export function Ipv6UlaGeneratorTool() {
  const [mac, setMac] = useState('20:37:06:12:34:56')

  const sections = useMemo(() => {
    const ts = Date.now()
    const hex40 = SHA1(String(ts) + mac)
      .toString()
      .substring(30)
    const ula = `fd${hex40.substring(0, 2)}:${hex40.substring(2, 6)}:${hex40.substring(6)}`
    return [
      { label: 'IPv6 ULA', value: `${ula}::/48` },
      { label: '首个 /64', value: `${ula}:0::/64` },
      { label: '末个 /64', value: `${ula}:ffff::/64` },
    ]
  }, [mac])

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        按常见做法：当前时间戳 + MAC，取 SHA-1 低 40 位生成 fd00::/8 ULA（非密码学随机源，适用于本地/内网联机标识）。
      </p>
      <input value={mac} onChange={(e) => setMac(e.target.value)} className="w-full rounded border px-3 py-2 font-mono text-sm" />
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.label} className="flex flex-wrap items-center justify-between gap-2 rounded bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{s.label}</span>
            <code className="text-xs">{s.value}</code>
            <button type="button" onClick={() => void navigator.clipboard.writeText(s.value)} className="text-xs text-orange-600">
              复制
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
