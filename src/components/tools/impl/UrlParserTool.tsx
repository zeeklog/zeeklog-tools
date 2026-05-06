'use client'

import { useMemo, useState } from 'react'
import { useToolLocale } from '@/components/tools/tool-locale'

export function UrlParserTool() {
  const locale = useToolLocale()
  const [raw, setRaw] = useState('https://user:pass@example.com:8080/path?q=1#hash')

  const parsed = useMemo(() => {
    try {
      const u = new URL(raw)
      return {
        href: u.href,
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        host: u.host,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        origin: u.origin,
        searchParams: Object.fromEntries(u.searchParams.entries()),
      }
    } catch {
      return null
    }
  }, [raw])

  return (
    <div className="space-y-4">
      <input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
      />
      {!parsed && <p className="text-sm text-red-600">{locale === 'zh' ? '无法解析 URL' : 'Could not parse URL'}</p>}
      {parsed && (
        <pre className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-xs">{JSON.stringify(parsed, null, 2)}</pre>
      )}
    </div>
  )
}
