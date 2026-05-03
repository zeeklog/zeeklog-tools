'use client'

import { useMemo, useState } from 'react'
import { convertBase } from '@/lib/tools/logic/integer-base'
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from '@/lib/tools/logic/ipv4'

export function Ipv4AddressConverterTool() {
  const [ip, setIp] = useState('192.168.1.1')

  const rows = useMemo(() => {
    if (!isValidIpv4(ip)) return null
    const dec = ipv4ToInt(ip)
    return [
      ['十进制', String(dec)],
      ['十六进制', convertBase({ value: String(dec), fromBase: 10, toBase: 16 }).toUpperCase()],
      ['二进制', convertBase({ value: String(dec), fromBase: 10, toBase: 2 })],
      ['IPv6 映射', ipv4ToIpv6({ ip })],
      ['IPv6 短前缀', ipv4ToIpv6({ ip, prefix: '::ffff:' })],
    ] as const
  }, [ip])

  return (
    <div className="space-y-4">
      <input value={ip} onChange={(e) => setIp(e.target.value)} className="w-full rounded-lg border px-3 py-2 font-mono text-sm" />
      {!rows && ip.trim() !== '' && <p className="text-sm text-red-600">无效 IPv4</p>}
      {rows && (
        <dl className="space-y-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap gap-2 text-sm">
              <dt className="w-28 text-gray-600">{k}</dt>
              <dd className="min-w-0 flex-1 break-all font-mono text-xs">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
