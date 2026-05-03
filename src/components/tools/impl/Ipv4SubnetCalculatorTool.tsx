'use client'

import { Netmask } from 'netmask'
import { useMemo, useState } from 'react'
import { getIPClass } from '@/lib/tools/logic/ipv4'

export function Ipv4SubnetCalculatorTool() {
  const [cidr, setCidr] = useState('192.168.0.1/24')

  const info = useMemo(() => {
    try {
      return new Netmask(cidr.trim())
    } catch {
      return null
    }
  }, [cidr])

  const ipClass = info ? getIPClass(info.base) : undefined

  return (
    <div className="space-y-4">
      <input value={cidr} onChange={(e) => setCidr(e.target.value)} className="w-full rounded-lg border px-3 py-2 font-mono text-sm" />
      {!info && cidr.trim() !== '' && <p className="text-sm text-red-600">无法解析 CIDR</p>}
      {info && (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <Row label="网络" v={info.base} />
          <Row label="掩码" v={info.mask} />
          <Row label="通配符" v={info.hostmask} />
          <Row label="CIDR" v={`/${info.bitmask}`} />
          <Row label="地址数" v={String(info.size)} />
          <Row label="首地址" v={info.first} />
          <Row label="末地址" v={info.last} />
          <Row label="广播" v={info.broadcast ?? '—'} />
          <Row label="IP 类" v={ipClass ?? '未知'} />
        </dl>
      )}
    </div>
  )
}

function Row({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 rounded bg-gray-50 px-3 py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-mono text-xs">{v}</span>
    </div>
  )
}
