'use client'

import Link from 'next/link'
import { MATRIX_FORMAT_SLUGS, matrixPairTitle } from '@/lib/tools/image-seo-presets'
import { toolSectionClass } from '@/components/tools/tool-field-classes'

function matrixLinks() {
  const out: { href: string; label: string }[] = []
  for (const from of MATRIX_FORMAT_SLUGS) {
    for (const to of MATRIX_FORMAT_SLUGS) {
      out.push({
        href: `/tools/${from}-to-${to}`,
        label: matrixPairTitle(from, to),
      })
    }
  }
  return out
}

const EXTRA: { href: string; label: string }[] = [
  { href: '/tools/jpg-to-png', label: 'JPG 转 PNG（本机处理）' },
  { href: '/tools/png-to-jpg', label: 'PNG 转 JPG（本机处理）' },
  { href: '/tools/bmp-to-jpg', label: 'BMP 转 JPG' },
  { href: '/tools/rounded-corner-image', label: '圆角 PNG 生成' },
  { href: '/tools/pdf-to-jpg', label: 'PDF 转 JPG' },
  { href: '/tools/pdf-to-png', label: 'PDF 转 PNG' },
  { href: '/tools/image-to-base64', label: '图片转 Base64 / Data URI' },
  { href: '/tools/base64-to-image', label: 'Base64 还原预览图片' },
  { href: '/tools/image-encode', label: 'PNG 隐写写入' },
  { href: '/tools/image-decoder', label: 'PNG 隐写读取' },
  { href: '/tools/favicon-generator', label: 'Favicon ICO 生成' },
  { href: '/tools/server-raster-image-converter', label: '自选目标格式的图片转换' },
  { href: '/tools/bitmap-image-suite', label: '位图工具合集（多模式切换）' },
]

export function ImageConverterHubTool() {
  const matrix = matrixLinks()
  return (
    <div className={toolSectionClass}>
      <p className="mb-4 text-sm text-slate-600">
        下列为按格式拆分的独立入口，便于检索与收藏；每个链接进入后已预选好转换方向。
      </p>
      <h2 className="mb-2 text-base font-semibold text-slate-900">格式矩阵（8×8）</h2>
      <ul className="mb-8 columns-1 gap-x-8 text-sm sm:columns-2 lg:columns-3">
        {matrix.map((x) => (
          <li key={x.href} className="mb-1 break-inside-avoid">
            <Link href={x.href} className="text-orange-700 underline hover:text-orange-900">
              {x.label}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-2 text-base font-semibold text-slate-900">其它图片工具入口</h2>
      <ul className="space-y-1 text-sm">
        {EXTRA.map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="text-orange-700 underline hover:text-orange-900">
              {x.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
