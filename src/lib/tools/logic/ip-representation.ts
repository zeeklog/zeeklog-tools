import { ipv4ToInt, isValidIpv4 } from '@/lib/tools/logic/ipv4'

function intToBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0')
}

function intToHexDotted(n: number): string {
  const a = (n >>> 24) & 255
  const b = (n >>> 16) & 255
  const c = (n >>> 8) & 255
  const d = n & 255
  return `0x${a.toString(16).padStart(2, '0')}.${b.toString(16).padStart(2, '0')}.${c.toString(16).padStart(2, '0')}.${d.toString(16).padStart(2, '0')}`
}

function intToOctalDotted(n: number): string {
  const a = (n >>> 24) & 255
  const b = (n >>> 16) & 255
  const c = (n >>> 8) & 255
  const d = n & 255
  return `${a.toString(8)}.${b.toString(8)}.${c.toString(8)}.${d.toString(8)}`
}

export type IpRepSummary = {
  dotted: string
  decimal: number
  binary32: string
  hexDotted: string
  octalDotted: string
} | { error: string }

export function summarizeIpv4Representations(ip: string): IpRepSummary {
  const t = ip.trim()
  if (!isValidIpv4(t)) return { error: '请输入合法的点分 IPv4 地址' }
  const n = ipv4ToInt(t)
  return {
    dotted: t,
    decimal: n >>> 0,
    binary32: intToBinary32(n),
    hexDotted: intToHexDotted(n),
    octalDotted: intToOctalDotted(n),
  }
}
