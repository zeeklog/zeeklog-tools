import { unescapeJsLikeString } from './escape-sequences'

/** 将文本转为可嵌入 JS 的模板字符串（反引号内容已转义） */
export function textToJsTemplateLiteral(text: string): string {
  const escaped = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  return '`' + escaped + '`'
}

/** 将文本转为双引号字符串字面量（内部 " \\ 换行等已转义） */
export function textToJsDoubleQuoted(text: string): string {
  let out = ''
  for (const ch of text) {
    const cp = ch.codePointAt(0)!
    switch (ch) {
      case '\\':
        out += '\\\\'
        break
      case '"':
        out += '\\"'
        break
      case '\n':
        out += '\\n'
        break
      case '\r':
        out += '\\r'
        break
      case '\t':
        out += '\\t'
        break
      default:
        if (cp < 32 || cp === 0x7f) {
          out += '\\u' + cp.toString(16).padStart(4, '0')
        } else if (cp <= 0xffff) {
          out += ch
        } else {
          const h = Math.floor((cp - 0x10000) / 0x400) + 0xd800
          const l = ((cp - 0x10000) % 0x400) + 0xdc00
          out += '\\u' + h.toString(16).padStart(4, '0') + '\\u' + l.toString(16).padStart(4, '0')
        }
    }
  }
  return '"' + out + '"'
}

/**
 * 粗略：去掉外层引号或反引号并做常见反转义（用于从字面量还原 HTML/文本）
 */
export function jsLiteralToText(input: string): { ok: true; text: string } | { ok: false; error: string } {
  const t = input.trim()
  if (t === '') return { ok: true, text: '' }
  try {
    if (t.startsWith('`') && t.endsWith('`') && t.length >= 2) {
      const inner = t.slice(1, -1).replace(/\\`/g, '`').replace(/\\\$\{/g, '${').replace(/\\\\/g, '\\')
      return { ok: true, text: inner }
    }
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      const q = t[0]!
      let inner = t.slice(1, -1)
      if (inner.includes('\n') && q === '"') {
        inner = inner.replace(/\\\n/g, '')
      }
      return { ok: true, text: unescapeJsLikeString(inner) }
    }
    return { ok: false, error: '请以 `...` 或 "..." 包裹字面量' }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '解析失败' }
  }
}
