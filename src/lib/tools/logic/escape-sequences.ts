/** JavaScript 风格字符串转义（用于生成可放入源码的字符串字面量） */
export function escapeJsString(input: string): string {
  let out = ''
  for (const ch of input) {
    const cp = ch.codePointAt(0)!
    switch (ch) {
      case '\\':
        out += '\\\\'
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
      case '\b':
        out += '\\b'
        break
      case '\f':
        out += '\\f'
        break
      case '"':
        out += '\\"'
        break
      case "'":
        out += "\\'"
        break
      default:
        if (cp >= 32 && cp <= 126) {
          out += ch
        } else if (cp <= 0xffff) {
          out += '\\u' + cp.toString(16).padStart(4, '0')
        } else {
          const h = Math.floor((cp - 0x10000) / 0x400) + 0xd800
          const l = ((cp - 0x10000) % 0x400) + 0xdc00
          out += '\\u' + h.toString(16).padStart(4, '0') + '\\u' + l.toString(16).padStart(4, '0')
        }
    }
  }
  return out
}

/**
 * 解码常见转义序列（支持 \\n \\r \\t \\uXXXX \\xNN \\\\ \\\" \\' 与 \\u{D+}）
 */
export function unescapeJsLikeString(input: string): string {
  const re =
    /\\(?:u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|([0-7]{1,3})|n|r|t|b|f|v|0|'|"|\\)/g
  return input.replace(re, (full, braced, u4, x2, oct) => {
    if (braced !== undefined) {
      const cp = parseInt(braced, 16)
      return String.fromCodePoint(cp)
    }
    if (u4 !== undefined) {
      return String.fromCharCode(parseInt(u4, 16))
    }
    if (x2 !== undefined) {
      return String.fromCharCode(parseInt(x2, 16))
    }
    if (oct !== undefined) {
      const v = parseInt(oct, 8)
      return String.fromCharCode(v & 0xff)
    }
    switch (full[1]) {
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      case 'b':
        return '\b'
      case 'f':
        return '\f'
      case 'v':
        return '\v'
      case '0':
        return '\0'
      case "'":
        return "'"
      case '"':
        return '"'
      case '\\':
        return '\\'
      default:
        return full
    }
  })
}

/** Java Native / ASCII 文件中的 \\uXXXX 形式（非 BMP 用代理对） */
export function textToJavaNativeAscii(input: string): string {
  let out = ''
  for (const ch of input) {
    const cp = ch.codePointAt(0)!
    if (cp < 128) {
      out += ch
    } else if (cp <= 0xffff) {
      out += '\\u' + cp.toString(16).padStart(4, '0')
    } else {
      const h = Math.floor((cp - 0x10000) / 0x400) + 0xd800
      const l = ((cp - 0x10000) % 0x400) + 0xdc00
      out += '\\u' + h.toString(16).padStart(4, '0') + '\\u' + l.toString(16).padStart(4, '0')
    }
  }
  return out
}

/** XML 文本节点与属性中需转义的字符 */
export function escapeXmlText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** 常见 XML/HTML 实体还原（不含所有命名实体） */
export function unescapeXmlText(input: string): string {
  return input
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/g, '&')
}

/** SQL 字符串字面量中单引号转义为两个单引号 */
export function escapeSqlStringLiteral(input: string): string {
  return input.replace(/'/g, "''")
}

/** CSV RFC4180：字段内含分隔符或换行时用双引号包裹 */
export function escapeCsvField(input: string): string {
  if (/[",\n\r]/.test(input)) return `"${input.replace(/"/g, '""')}"`
  return input
}

/** C# 普通双引号字符串字面量（与 JS 常见转义一致：\\ \" \\n 等） */
export function escapeCSharpString(input: string): string {
  return escapeJsString(input)
}

export function javaNativeAsciiToText(input: string): string {
  let i = 0
  let out = ''
  while (i < input.length) {
    if (input[i] === '\\' && input[i + 1] === 'u' && /^[0-9a-fA-F]{4}/.test(input.slice(i + 2, i + 6))) {
      const hi = parseInt(input.slice(i + 2, i + 6), 16)
      i += 6
      if (hi >= 0xd800 && hi <= 0xdbff && input[i] === '\\' && input[i + 1] === 'u' && /^[0-9a-fA-F]{4}/.test(input.slice(i + 2, i + 6))) {
        const lo = parseInt(input.slice(i + 2, i + 6), 16)
        if (lo >= 0xdc00 && lo <= 0xdfff) {
          const cp = (hi - 0xd800) * 0x400 + (lo - 0xdc00) + 0x10000
          out += String.fromCodePoint(cp)
          i += 6
          continue
        }
      }
      out += String.fromCharCode(hi)
    } else {
      out += input[i]!
      i += 1
    }
  }
  return out
}
