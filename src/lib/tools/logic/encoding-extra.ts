import bs58 from 'bs58'

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function bytesToBase32(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ''
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]!
    bits += 8
    while (bits >= 5) {
      output += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    output += B32[(value << (5 - bits)) & 31]
  }
  while (output.length % 8 !== 0) {
    output += '='
  }
  return output
}

function base32ToBytes(s: string): Uint8Array {
  const clean = s.replace(/=+$/g, '').toUpperCase().replace(/\s/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (let i = 0; i < clean.length; i++) {
    const idx = B32.indexOf(clean[i]!)
    if (idx === -1) throw new Error(`非法 Base32 字符: ${clean[i]}`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return new Uint8Array(out)
}

export function textToBase32(text: string): string {
  return bytesToBase32(new TextEncoder().encode(text))
}

export function base32ToText(b32: string): string {
  return new TextDecoder().decode(base32ToBytes(b32))
}

export function textToBase58(text: string): string {
  return bs58.encode(new TextEncoder().encode(text))
}

export function base58ToText(b58: string): string {
  return new TextDecoder().decode(bs58.decode(b58.trim()))
}

/** JSON 字符串作为值的 URL 查询安全：对 UTF-8 做百分号编码（与 encodeURIComponent 语义一致） */
export function jsonStringForUrlQuery(jsonText: string): string {
  JSON.parse(jsonText)
  return encodeURIComponent(jsonText)
}

export function urlQueryToJsonString(encoded: string): string {
  const dec = decodeURIComponent(encoded.trim())
  const v = JSON.parse(dec)
  return JSON.stringify(v)
}
