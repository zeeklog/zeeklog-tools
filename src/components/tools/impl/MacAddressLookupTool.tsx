'use client'

import { useEffect, useMemo, useState } from 'react'

function ouiKey(address: string): string {
  return address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6)
}

export function MacAddressLookupTool() {
  const [mac, setMac] = useState('20:37:06:12:34:56')
  const [db, setDb] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    void import('oui-data').then((m) => setDb((m as { default: Record<string, string> }).default))
  }, [])

  const details = useMemo(() => {
    if (!db) return undefined
    return db[ouiKey(mac)]
  }, [db, mac])

  return (
    <div className="space-y-4">
      <input value={mac} onChange={(e) => setMac(e.target.value)} className="w-full rounded-lg border px-3 py-2 font-mono text-sm" />
      {!db && <p className="text-sm text-gray-500">正在加载 OUI 数据库…</p>}
      {db && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
          {details ? (
            details.split('\n').map((line, i) => <div key={i}>{line}</div>)
          ) : (
            <span className="text-gray-500">未找到厂商信息</span>
          )}
        </div>
      )}
    </div>
  )
}
