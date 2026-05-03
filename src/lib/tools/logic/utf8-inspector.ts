const enc = new TextEncoder()
const dec = new TextDecoder('utf-8', { fatal: false })

export function textToUtf8HexBytes(text: string): string {
  const bytes = enc.encode(text)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ')
}

/** 按字节做百分号编码（类似对 UTF-8 字节序列做 encodeURIComponent 的逐字节版） */
export function textToUtf8PercentEncoded(text: string): string {
  const bytes = enc.encode(text)
  let out = ''
  for (const b of bytes) {
    if ((b >= 0x30 && b <= 0x39) || (b >= 0x41 && b <= 0x5a) || (b >= 0x61 && b <= 0x7a) || b === 0x2d || b === 0x5f || b === 0x2e || b === 0x7e) {
      out += String.fromCharCode(b)
    } else {
      out += '%' + b.toString(16).toUpperCase().padStart(2, '0')
    }
  }
  return out
}

function percentOrPlainToBytes(s: string): Uint8Array {
  const parts: number[] = []
  let i = 0
  while (i < s.length) {
    if (s[i] === '%' && /^[0-9A-Fa-f]{2}/.test(s.slice(i + 1, i + 3))) {
      parts.push(parseInt(s.slice(i + 1, i + 3), 16))
      i += 3
    } else {
      parts.push(s.charCodeAt(i) & 0xff)
      i += 1
    }
  }
  return new Uint8Array(parts)
}

export function utf8HexOrPercentToText(input: string): { ok: true; text: string } | { ok: false; error: string } {
  const t = input.trim()
  if (t === '') return { ok: true, text: '' }
  try {
    if (t.includes('%')) {
      const bytes = percentOrPlainToBytes(t)
      return { ok: true, text: dec.decode(bytes) }
    }
    const hex = t.replace(/\s+/g, '')
    if (hex.length % 2 !== 0) {
      return { ok: false, error: '十六进制长度须为偶数位' }
    }
    if (!/^[0-9a-fA-F]*$/.test(hex)) {
      return { ok: false, error: '仅支持十六进制空格分隔或 %XX 编码' }
    }
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    return { ok: true, text: dec.decode(bytes) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '解码失败' }
  }
}
