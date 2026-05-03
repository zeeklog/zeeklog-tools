import { NextRequest, NextResponse } from 'next/server'
import { composerize } from 'composerize-ts'
import { logServerError } from '@/lib/error-handler'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ yaml: '', error: '请求体须为 JSON' }, { status: 400 })
  }
  const raw = typeof body === 'object' && body !== null && 'raw' in body && typeof (body as { raw: unknown }).raw === 'string' ? (body as { raw: string }).raw : ''
  if (raw.trim() === '') {
    return NextResponse.json({ yaml: '', error: '' })
  }
  try {
    const r = composerize(raw)
    return NextResponse.json({ yaml: r.yaml, error: '' })
  } catch (e) {
    logServerError(e, 'POST /api/tools/composerize')
    return NextResponse.json({ yaml: '', error: '转换失败，请检查输入后重试' })
  }
}
