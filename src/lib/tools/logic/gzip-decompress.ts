import { inflate, ungzip } from 'pako'

export type GzipResult =
  | { ok: true; text: string; used: 'gzip' | 'zlib' }
  | { ok: false; message: string }

/** 尝试 gzip 或 zlib(raw deflate) 解压为 UTF-8 文本 */
export function decompressGzipOrZlib(bytes: Uint8Array): GzipResult {
  try {
    const asUtf8 = (u: Uint8Array, label: 'gzip' | 'zlib'): GzipResult => {
      const text = new TextDecoder('utf-8', { fatal: false }).decode(u)
      return { ok: true, text, used: label }
    }
    try {
      const out = ungzip(bytes)
      return asUtf8(out, 'gzip')
    } catch {
      const out = inflate(bytes)
      return asUtf8(out, 'zlib')
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: `解压失败：${msg}` }
  }
}
