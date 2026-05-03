/**
 * PNG 载体 LSB 隐写（非对抗场景：无鲁棒性保证，JPEG 会破坏载荷）。
 * 使用 RGB 三通道最低位，前 32 bit 为载荷字节长度（little-endian），随后为 UTF-8 字节。
 */

function bytesToBits(bytes: Uint8Array): (0 | 1)[] {
  const bits: (0 | 1)[] = []
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]!
    for (let j = 0; j < 8; j++) {
      bits.push((((b >> (7 - j)) & 1) as 0 | 1) ?? 0)
    }
  }
  return bits
}

function bitsToBytes(bits: (0 | 1)[]): Uint8Array {
  const out: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let v = 0
    for (let j = 0; j < 8; j++) {
      v = (v << 1) | (bits[i + j]! & 1)
    }
    out.push(v)
  }
  return new Uint8Array(out)
}

/** 从左上角起按行遍历像素 RGB 低位读取 bit */
function readBitsRgb(imageData: ImageData, count: number): (0 | 1)[] {
  const d = imageData.data
  const w = imageData.width
  const bits: (0 | 1)[] = []
  outer: for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4
      for (const c of [0, 1, 2] as const) {
        if (bits.length >= count) break outer
        bits.push((d[p + c]! & 1) as 0 | 1)
      }
    }
  }
  return bits
}

/** 同上顺序写入 bit（覆盖 RGB 最低位） */
function writeBitsRgb(imageData: ImageData, bits: (0 | 1)[]): void {
  const d = imageData.data
  const w = imageData.width
  let bitIdx = 0
  outer: for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4
      for (const c of [0, 1, 2] as const) {
        if (bitIdx >= bits.length) break outer
        d[p + c] = (d[p + c]! & 0xfe) | bits[bitIdx]!
        bitIdx++
      }
    }
  }
  if (bitIdx < bits.length) {
    throw new Error('容量不足')
  }
}

export function maxHiddenUtf8Bytes(imageData: ImageData): number {
  const maxBits = imageData.width * imageData.height * 3
  return Math.max(0, Math.floor(maxBits / 8) - 4)
}

export function encodeTextIntoImageData(imageData: ImageData, text: string): void {
  const enc = new TextEncoder()
  const payload = enc.encode(text)
  const len = payload.length
  if (len > 0xffff_ffff) {
    throw new Error('文本过长')
  }
  const lenBuf = new Uint8Array(4)
  new DataView(lenBuf.buffer).setUint32(0, len, true)
  const all = new Uint8Array(4 + payload.length)
  all.set(lenBuf, 0)
  all.set(payload, 4)
  const bits = bytesToBits(all)
  const maxBits = imageData.width * imageData.height * 3
  if (bits.length > maxBits) {
    throw new Error('文本过长，请换更大 PNG 或缩短内容')
  }
  writeBitsRgb(imageData, bits)
}

export function decodeTextFromImageData(imageData: ImageData): string {
  const maxBits = imageData.width * imageData.height * 3
  const all = readBitsRgb(imageData, maxBits)
  const lenBits = all.slice(0, 32)
  const lenBytes = bitsToBytes(lenBits)
  if (lenBytes.length < 4) {
    throw new Error('无法读取长度')
  }
  const byteLen = new DataView(lenBytes.buffer, lenBytes.byteOffset, 4).getUint32(0, true)
  if (byteLen > 10_000_000) {
    throw new Error('长度异常')
  }
  if (32 + byteLen * 8 > all.length) {
    throw new Error('数据不完整或不是有效隐写图')
  }
  const payloadBits = all.slice(32, 32 + byteLen * 8)
  const payload = bitsToBytes(payloadBits)
  if (payload.length < byteLen) {
    throw new Error('数据不完整或不是有效隐写图')
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(payload.subarray(0, byteLen))
}
