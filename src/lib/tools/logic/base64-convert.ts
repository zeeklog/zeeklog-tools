/** 自 online-tool-box/src/utils/base64.ts 迁移；字符串编解码按 UTF-8 字节（支持中文等 Unicode） */

function utf8ToBinaryString(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += String.fromCharCode(bytes[i]!)
  }
  return out
}

function binaryStringToUtf8(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

function btoaUtf8(str: string): string {
  return globalThis.btoa(utf8ToBinaryString(str))
}

function atobToUtf8(b64: string): string {
  return binaryStringToUtf8(globalThis.atob(b64))
}

function makeUriSafe(encoded: string) {
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function unURI(encoded: string): string {
  return encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/[^A-Za-z0-9+/]/g, '')
}

function removePotentialPadding(str: string) {
  return str.replace(/=/g, '')
}

export function removePotentialDataAndMimePrefix(str: string) {
  return str.replace(/^data:.*?;base64,/, '')
}

export function isValidBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  let cleanStr = removePotentialDataAndMimePrefix(str)
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr)
  }

  try {
    if (makeUrlSafe) {
      return removePotentialPadding(globalThis.btoa(globalThis.atob(cleanStr))) === cleanStr
    }
    return globalThis.btoa(globalThis.atob(cleanStr)) === cleanStr
  } catch {
    return false
  }
}

export function textToBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  const encoded = btoaUtf8(str)
  return makeUrlSafe ? makeUriSafe(encoded) : encoded
}

export function base64ToText(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  if (!isValidBase64(str, { makeUrlSafe })) {
    throw new Error('Incorrect base64 string')
  }

  let cleanStr = removePotentialDataAndMimePrefix(str)
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr)
  }

  try {
    return atobToUtf8(cleanStr)
  } catch {
    throw new Error('Incorrect base64 string')
  }
}
