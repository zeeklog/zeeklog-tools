import dns from 'node:dns/promises'
import { NextResponse } from 'next/server'
import { logServerError } from '@/lib/error-handler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 5000

function isSafeHostname(h: string): boolean {
  if (h.length === 0 || h.length > 253) return false
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.?$/.test(h)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const hostname = searchParams.get('hostname')?.trim().replace(/\.$/, '') ?? ''
  const type = (searchParams.get('type') || 'A').toUpperCase()

  if (!hostname) {
    return NextResponse.json({ error: '缺少必填参数 hostname' }, { status: 400 })
  }
  if (!isSafeHostname(hostname)) {
    return NextResponse.json({ error: 'hostname 格式无效' }, { status: 400 })
  }

  const allowed = new Set(['A', 'AAAA', 'MX', 'NS', 'TXT'])
  if (!allowed.has(type)) {
    return NextResponse.json({ error: `type 必须是 ${[...allowed].join(', ')} 之一` }, { status: 400 })
  }

  const run = async () => {
    switch (type) {
      case 'A':
        return { records: await dns.resolve4(hostname) }
      case 'AAAA':
        return { records: await dns.resolve6(hostname) }
      case 'MX':
        return { records: await dns.resolveMx(hostname) }
      case 'NS':
        return { records: await dns.resolveNs(hostname) }
      case 'TXT':
        return { records: await dns.resolveTxt(hostname) }
      default:
        throw new Error('unsupported')
    }
  }

  const timeout = new Promise<never>((_, rej) => {
    setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS)
  })

  try {
    const data = await Promise.race([run(), timeout])
    return NextResponse.json({ hostname, type, ...data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg === 'timeout') {
      return NextResponse.json({ error: `DNS 查询超时（>${TIMEOUT_MS}ms）` }, { status: 504 })
    }
    logServerError(e, 'GET /api/tools/dns-lookup')
    return NextResponse.json({ error: 'DNS 查询失败，请稍后重试' }, { status: 502 })
  }
}
