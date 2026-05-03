import { convertBase } from '@/lib/tools/logic/integer-base'

export function getIPClass(ip: string): string | undefined {
  const firstOctet = Number(ip.split('.')[0])
  if (Number.isNaN(firstOctet)) return undefined
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D'
  if (firstOctet < 256) return 'E'
  return undefined
}

export function isValidIpv4(ip: string): boolean {
  const clean = ip.trim()
  const parts = clean.split('.')
  if (parts.length !== 4) return false
  return parts.every((p) => {
    const n = Number(p)
    return Number.isInteger(n) && n >= 0 && n <= 255 && p === String(n)
  })
}

export function ipv4ToInt(ip: string): number {
  if (!isValidIpv4(ip)) return 0
  return ip
    .trim()
    .split('.')
    .reduce((acc, part, index) => acc + Number(part) * 256 ** (3 - index), 0)
}

export function ipv4ToIpv6({
  ip,
  prefix = '0000:0000:0000:0000:0000:ffff:',
}: {
  ip: string
  prefix?: string
}): string {
  if (!isValidIpv4(ip)) return ''
  const hexPairs = ip
    .trim()
    .split('.')
    .map((part) => Number.parseInt(part, 10).toString(16).padStart(2, '0'))
  const chunks: string[] = []
  for (let i = 0; i < hexPairs.length; i += 2) {
    chunks.push(hexPairs[i]! + hexPairs[i + 1]!)
  }
  return prefix + chunks.join(':')
}

function bits2ip(ipInt: number): string {
  return `${ipInt >>> 24}.${(ipInt >> 16) & 255}.${(ipInt >> 8) & 255}.${ipInt & 255}`
}

function getRangesize(start: string, end: string): number {
  return 1 + Number.parseInt(end, 2) - Number.parseInt(start, 2)
}

function getCidr(start: string, end: string): { start: string; end: string; mask: number } | null {
  const range = getRangesize(start, end)
  if (range < 1) return null

  let mask = 32
  for (let i = 0; i < 32; i++) {
    if (start[i] !== end[i]) {
      mask = i
      break
    }
  }

  const newStart = start.substring(0, mask) + '0'.repeat(32 - mask)
  const newEnd = end.substring(0, mask) + '1'.repeat(32 - mask)
  return { start: newStart, end: newEnd, mask }
}

export type Ipv4RangeResult = {
  newStart?: string
  newEnd?: string
  newCidr?: string
  newSize?: number
  oldSize?: number
}

export function calculateIpv4RangeCidr({ startIp, endIp }: { startIp: string; endIp: string }): Ipv4RangeResult | undefined {
  if (!isValidIpv4(startIp) || !isValidIpv4(endIp)) return undefined

  const start = convertBase({
    value: ipv4ToInt(startIp).toString(),
    fromBase: 10,
    toBase: 2,
  }).padStart(32, '0')
  const end = convertBase({
    value: ipv4ToInt(endIp).toString(),
    fromBase: 10,
    toBase: 2,
  }).padStart(32, '0')

  const cidr = getCidr(start, end)
  if (!cidr) return undefined

  const newEnd = bits2ip(Number.parseInt(cidr.end, 2))
  const newStart = bits2ip(Number.parseInt(cidr.start, 2))
  return {
    newEnd,
    newStart,
    newCidr: `${newStart}/${cidr.mask}`,
    newSize: getRangesize(cidr.start, cidr.end),
    oldSize: getRangesize(start, end),
  }
}
