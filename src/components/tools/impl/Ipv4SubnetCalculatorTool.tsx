'use client'

import { Netmask } from 'netmask'
import { useMemo, useState } from 'react'
import { useToolLocale } from '@/components/tools/tool-locale'
import { getIPClass } from '@/lib/tools/logic/ipv4'

export function Ipv4SubnetCalculatorTool() {
  const locale = useToolLocale()
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
      {!info && cidr.trim() !== '' && <p className="text-sm text-red-600">{locale === 'zh' ? '无法解析 CIDR' : 'Could not parse CIDR'}</p>}
      {info && (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <Row label={locale === 'zh' ? '网络' : 'Network'} v={info.base} />
          <Row label={locale === 'zh' ? '掩码' : 'Mask'} v={info.mask} />
          <Row label={locale === 'zh' ? '通配符' : 'Wildcard'} v={info.hostmask} />
          <Row label="CIDR" v={`/${info.bitmask}`} />
          <Row label={locale === 'zh' ? '地址数' : 'Address count'} v={String(info.size)} />
          <Row label={locale === 'zh' ? '首地址' : 'First address'} v={info.first} />
          <Row label={locale === 'zh' ? '末地址' : 'Last address'} v={info.last} />
          <Row label={locale === 'zh' ? '广播' : 'Broadcast'} v={info.broadcast ?? '—'} />
          <Row label={locale === 'zh' ? 'IP 类' : 'IP class'} v={ipClass ?? (locale === 'zh' ? '未知' : 'Unknown')} />
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
