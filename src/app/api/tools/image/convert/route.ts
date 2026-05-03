import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { logServerError } from '@/lib/error-handler'
import {
  TOOL_IMAGE_MAX_UPLOAD_BYTES,
  clampResizePercent,
  isServerImageTargetFormat,
  type ServerImageTargetFormat,
} from '@/lib/tools/image-server-limits'

export const runtime = 'nodejs'
export const maxDuration = 60

function extForTarget(t: ServerImageTargetFormat): string {
  if (t === 'jpeg') return 'jpg'
  return t
}

async function convertBuffer(
  input: Buffer,
  target: ServerImageTargetFormat,
  resizePercent?: number,
): Promise<{ body: Buffer; contentType: string; filename: string }> {
  const pct = resizePercent ?? 100
  let pipeline = sharp(input, { pages: 1, failOn: 'none' }).rotate()

  if (pct !== 100) {
    const meta = await sharp(input).metadata()
    const w = meta.width ?? 1
    const h = meta.height ?? 1
    const nw = Math.max(1, Math.round((w * pct) / 100))
    const nh = Math.max(1, Math.round((h * pct) / 100))
    pipeline = pipeline.resize(nw, nh)
  }

  switch (target) {
    case 'jpeg': {
      const body = await pipeline.clone().jpeg({ quality: 88, mozjpeg: true }).toBuffer()
      return { body, contentType: 'image/jpeg', filename: `converted.${extForTarget(target)}` }
    }
    case 'png': {
      const body = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer()
      return { body, contentType: 'image/png', filename: `converted.${extForTarget(target)}` }
    }
    case 'webp': {
      const body = await pipeline.clone().webp({ quality: 88 }).toBuffer()
      return { body, contentType: 'image/webp', filename: `converted.${extForTarget(target)}` }
    }
    case 'gif': {
      const body = await pipeline.clone().gif().toBuffer()
      return { body, contentType: 'image/gif', filename: `converted.${extForTarget(target)}` }
    }
    case 'tiff': {
      const body = await pipeline.clone().tiff({ compression: 'lzw' }).toBuffer()
      return { body, contentType: 'image/tiff', filename: `converted.${extForTarget(target)}` }
    }
    case 'avif': {
      const body = await pipeline.clone().avif({ quality: 50 }).toBuffer()
      return { body, contentType: 'image/avif', filename: `converted.${extForTarget(target)}` }
    }
    case 'ico': {
      const pngSquare = await pipeline
        .clone()
        .resize(256, 256, { fit: 'cover', position: sharp.strategy.attention })
        .png()
        .toBuffer()
      const body = await pngToIco(pngSquare)
      return { body: Buffer.from(body), contentType: 'image/x-icon', filename: 'favicon.ico' }
    }
    default: {
      const _: never = target
      throw new Error(`unsupported target ${_}`)
    }
  }
}

export async function POST(request: NextRequest) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: '无法解析上传内容' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: '请上传有效的图片文件' }, { status: 400 })
  }
  if (file.size > TOOL_IMAGE_MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: '文件过大，请压缩后重试' }, { status: 413 })
  }

  const targetRaw = typeof form.get('targetFormat') === 'string' ? (form.get('targetFormat') as string) : ''
  if (!isServerImageTargetFormat(targetRaw)) {
    return NextResponse.json({ error: '不支持的目标格式' }, { status: 400 })
  }
  const target = targetRaw

  const resizeRaw = form.get('resizePercent')
  let resizePercent: number | undefined
  if (typeof resizeRaw === 'string' && resizeRaw.trim() !== '') {
    const n = Number(resizeRaw)
    resizePercent = clampResizePercent(n)
    if (resizePercent === undefined) {
      return NextResponse.json({ error: '缩放比例须在 1–200 之间' }, { status: 400 })
    }
  }

  let buf: Buffer
  try {
    buf = Buffer.from(await file.arrayBuffer())
  } catch (e) {
    logServerError(e, 'POST /api/tools/image/convert read')
    return NextResponse.json({ error: '读取文件失败，请稍后重试' }, { status: 500 })
  }

  try {
    const { body, contentType, filename } = await convertBuffer(buf, target, resizePercent)
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    logServerError(e, 'POST /api/tools/image/convert sharp')
    return NextResponse.json({ error: '图片处理失败，请换图或换格式后重试' }, { status: 500 })
  }
}
