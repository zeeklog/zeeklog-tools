/**
 * OG / Twitter / JSON-LD 等用的绝对地址与关键词
 */
export function resolveAbsoluteSiteUrl(siteBase: string, src: string | null | undefined): string | undefined {
  const s = src?.trim()
  if (!s) return undefined
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  const base = siteBase.replace(/\/$/, '')
  if (s.startsWith('/')) return `${base}${s}`
  return s
}

export function articleTagsAsKeywords(tags: unknown): string[] | undefined {
  if (!Array.isArray(tags)) return undefined
  const list = tags.filter((t): t is string => typeof t === 'string').slice(0, 16)
  return list.length ? list : undefined
}

/** 嵌入 `<script type="application/ld+json">` 时禁用危险的 `<` / Unicode 行分隔符 */
export function serializeJsonLdForScript(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
