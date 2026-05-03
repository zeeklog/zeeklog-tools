'use client'

import { useMemo, useState } from 'react'
import { calculateIpv4RangeCidr, isValidIpv4 } from '@/lib/tools/logic/ipv4'

export function Ipv4RangeExpanderTool() {
  const [start, setStart] = useState('192.168.1.1')
  const [end, setEnd] = useState('192.168.6.255')

  const result = useMemo(() => {
    if (!isValidIpv4(start) || !isValidIpv4(end)) return null
    return calculateIpv4RangeCidr({ startIp: start, endIp: end })
  }, [start, end])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input value={start} onChange={(e) => setStart(e.target.value)} placeholder="起始" className="rounded border px-3 py-2 font-mono text-sm" />
        <input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="结束" className="rounded border px-3 py-2 font-mono text-sm" />
      </div>
      {(!isValidIpv4(start) || !isValidIpv4(end)) && (start || end) && <p className="text-sm text-red-600">请输入有效 IPv4</p>}
      {result && (
        <table className="w-full text-left text-sm">
          <tbody>
            <tr className="border-t">
              <th className="py-2 pr-4">新起始</th>
              <td className="font-mono">{result.newStart}</td>
            </tr>
            <tr className="border-t">
              <th className="py-2 pr-4">新结束</th>
              <td className="font-mono">{result.newEnd}</td>
            </tr>
            <tr className="border-t">
              <th className="py-2 pr-4">CIDR</th>
              <td className="font-mono">{result.newCidr}</td>
            </tr>
            <tr className="border-t">
              <th className="py-2 pr-4">原范围地址数</th>
              <td>{result.oldSize?.toLocaleString()}</td>
            </tr>
            <tr className="border-t">
              <th className="py-2 pr-4">CIDR 内地址数</th>
              <td>{result.newSize?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
