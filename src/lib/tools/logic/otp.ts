import { HmacSHA1, enc } from 'crypto-js'
import { createToken } from '@/lib/tools/logic/token-generator'

export function hexToBytes(hex: string): number[] {
  return (hex.match(/.{1,2}/g) ?? []).map((char) => Number.parseInt(char, 16))
}

function computeHMACSha1(message: string, key: string): string {
  return HmacSHA1(enc.Hex.parse(message), enc.Hex.parse(base32toHex(key))).toString(enc.Hex)
}

export function base32toHex(base32: string): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

  const bits = base32
    .toUpperCase()
    .replace(/=+$/, '')
    .split('')
    .map((value) => base32Chars.indexOf(value).toString(2).padStart(5, '0'))
    .join('')

  const hex = (bits.match(/.{1,8}/g) ?? [])
    .map((chunk) => Number.parseInt(chunk, 2).toString(16).padStart(2, '0'))
    .join('')

  return hex
}

export function generateHOTP({ key, counter = 0 }: { key: string; counter?: number }): string {
  const digest = computeHMACSha1(counter.toString(16).padStart(16, '0'), key)
  const bytes = hexToBytes(digest)
  const offset = bytes[19]! & 0xf
  const v =
    ((bytes[offset]! & 0x7f) << 24) |
    ((bytes[offset + 1]! & 0xff) << 16) |
    ((bytes[offset + 2]! & 0xff) << 8) |
    (bytes[offset + 3]! & 0xff)
  return String(v % 1_000_000).padStart(6, '0')
}

export function getCounterFromTime({ now, timeStep }: { now: number; timeStep: number }): number {
  return Math.floor(now / 1000 / timeStep)
}

export function generateTOTP({ key, now = Date.now(), timeStep = 30 }: { key: string; now?: number; timeStep?: number }): string {
  const counter = getCounterFromTime({ now, timeStep })
  return generateHOTP({ key, counter })
}

export function buildKeyUri({
  secret,
  app = 'online-toolkit',
  account = 'demo-user',
  algorithm = 'SHA1',
  digits = 6,
  period = 30,
}: {
  secret: string
  app?: string
  account?: string
  algorithm?: string
  digits?: number
  period?: number
}): string {
  const params = new URLSearchParams({
    issuer: app,
    secret,
    algorithm,
    digits: String(digits),
    period: String(period),
  })
  return `otpauth://totp/${encodeURIComponent(app)}:${encodeURIComponent(account)}?${params.toString()}`
}

export function generateOtpSecret(): string {
  return createToken({ length: 16, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' })
}
