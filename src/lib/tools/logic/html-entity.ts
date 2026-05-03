/**
 * 与 lodash escape / unescape（HTML 实体子集）一致，
 * 对照 online-tool-box/src/tools/html-entities/html-entities.vue
 */
const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const htmlUnescapes: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

const reUnescapedHtml = /[&<>"']/g
const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g

export function escapeHtmlEntities(str: string): string {
  return str.replace(reUnescapedHtml, (chr) => htmlEscapes[chr] ?? chr)
}

export function unescapeHtmlEntities(str: string): string {
  return str.replace(reEscapedHtml, (entity) => htmlUnescapes[entity] ?? entity)
}
