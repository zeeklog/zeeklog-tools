/** 服务端图片工具：上传与输出约束（与 API 路由一致） */

export const TOOL_IMAGE_MAX_UPLOAD_BYTES = 20 * 1024 * 1024

/** sharp / png-to-ico 管线支持的输出类型（不含矢量 PSD/SVG 作为无损矢量输出） */
export const SERVER_IMAGE_TARGET_FORMATS = [
  'jpeg',
  'png',
  'webp',
  'gif',
  'tiff',
  'avif',
  'ico',
] as const

export type ServerImageTargetFormat = (typeof SERVER_IMAGE_TARGET_FORMATS)[number]

export function isServerImageTargetFormat(s: string): s is ServerImageTargetFormat {
  return (SERVER_IMAGE_TARGET_FORMATS as readonly string[]).includes(s)
}

/** 缩放百分比 1–200，100 表示不变 */
export function clampResizePercent(n: number | undefined): number | undefined {
  if (n === undefined || Number.isNaN(n)) return undefined
  const v = Math.round(n)
  if (v < 1 || v > 200) return undefined
  return v
}
