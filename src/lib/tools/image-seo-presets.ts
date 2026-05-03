import type { ServerImageTargetFormat } from '@/lib/tools/image-server-limits'
import { isServerImageTargetFormat } from '@/lib/tools/image-server-limits'

/** 与 toolgg 矩阵一致的八种格式 slug（小写） */
export const MATRIX_FORMAT_SLUGS = ['ico', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'psd'] as const

const LABEL: Record<(typeof MATRIX_FORMAT_SLUGS)[number], string> = {
  ico: 'ICO',
  jpeg: 'JPEG',
  png: 'PNG',
  gif: 'GIF',
  webp: 'WEBP',
  bmp: 'BMP',
  svg: 'SVG',
  psd: 'PSD',
}

export function isMatrixFormatSlug(s: string): s is (typeof MATRIX_FORMAT_SLUGS)[number] {
  return (MATRIX_FORMAT_SLUGS as readonly string[]).includes(s)
}

export function parseMatrixSlug(
  slug: string,
): { from: (typeof MATRIX_FORMAT_SLUGS)[number]; to: (typeof MATRIX_FORMAT_SLUGS)[number] } | null {
  const m = /^([a-z0-9]+)-to-([a-z0-9]+)$/.exec(slug)
  if (!m) return null
  const from = m[1]!
  const to = m[2]!
  if (!isMatrixFormatSlug(from) || !isMatrixFormatSlug(to)) return null
  return { from, to }
}

/** 矩阵目标：服务端可直接输出的格式；否则用 PNG 兜底（SVG/PSD/BMP 作目标时） */
export function matrixTargetToServerFormat(
  to: (typeof MATRIX_FORMAT_SLUGS)[number],
): { format: ServerImageTargetFormat; fallbackFromMatrix: boolean } {
  if (isServerImageTargetFormat(to)) {
    return { format: to, fallbackFromMatrix: false }
  }
  return { format: 'png', fallbackFromMatrix: true }
}

export function matrixPairTitle(from: (typeof MATRIX_FORMAT_SLUGS)[number], to: (typeof MATRIX_FORMAT_SLUGS)[number]): string {
  return `在线${LABEL[from]} 转 ${LABEL[to]}`
}

export function matrixPairDescription(
  from: (typeof MATRIX_FORMAT_SLUGS)[number],
  to: (typeof MATRIX_FORMAT_SLUGS)[number],
): string {
  const hint =
    to === 'svg' || to === 'psd' || to === 'bmp'
      ? '（栅格输出时本站以 PNG 为主，便于兼容预览与下载；矢量/PSD 原生文件请使用专业软件。）'
      : ''
  return `上传 ${LABEL[from]} 图片，转换为 ${LABEL[to]} 或等价可下载格式；可选缩放比例，上传后即可在线转换。${hint} 在线工具，${LABEL[from]} 转 ${LABEL[to]}，online`
}

export function formatLabelForSlug(slug: string): string {
  if (isMatrixFormatSlug(slug)) return LABEL[slug]
  if (slug === 'jpg') return 'JPG'
  return slug.toUpperCase()
}

/** 供工具详情页关键词区：矩阵页与独立 SEO 入口 */
export function imageSeoFeatureKeywords(slug: string): string[] | null {
  const m = parseMatrixSlug(slug)
  if (m) {
    return [
      matrixPairTitle(m.from, m.to),
      `${LABEL[m.from]} 转 ${LABEL[m.to]}`,
      '图片格式转换',
      '在线转换',
      '上传即可',
      '免费在线',
    ]
  }
  const extras: Record<string, string[]> = {
    'image-converter-hub': ['图片工具导航', '格式转换索引', 'PNG JPG WEBP ICO', '站内工具互链', '8×8 转换矩阵'],
    'jpg-to-png': ['JPG 转 PNG', 'JPEG 转 PNG', '本机处理', '无损导出'],
    'png-to-jpg': ['PNG 转 JPG', 'PNG 转 JPEG', '压缩体积'],
    'bmp-to-jpg': ['BMP 转 JPG', '位图转 JPEG'],
    'rounded-corner-image': ['圆角图片', '圆角 PNG', '头像圆角'],
    'pdf-to-jpg': ['PDF 转 JPG', 'PDF 每页图片', '按页导出'],
    'pdf-to-png': ['PDF 转 PNG', 'PDF 每页图片', '按页导出'],
    'image-to-base64': ['图片 Base64', 'Data URI', '嵌入 HTML', '嵌入 CSS'],
    'base64-to-image': ['Base64 预览', 'data URI 解析', '图片还原'],
    'image-encode': ['PNG 隐写写入', '隐藏短文本'],
    'image-decoder': ['PNG 隐写读取', '提取隐藏文本'],
    favicon: ['Favicon', 'ICO', '网站图标', '标签页图标'],
    'favicon-generator': ['Favicon 生成', 'ICO 下载', '多尺寸图标'],
  }
  return extras[slug] ?? null
}
