import catalog from './catalog.json'
import catalogImageSeo from './catalog.image-seo.json'
import type { ToolCategory, ToolDefinition } from './types'
import type { Locale } from '@/lib/i18n'
import { DEFAULT_LOCALE } from '@/lib/i18n'

const CATALOG_DESCRIPTION_TAIL = /\s*在线工具，[^。！？]*online\s*$/i

function sanitizeToolDescription(description: string): string {
  const cleaned = description.replace(CATALOG_DESCRIPTION_TAIL, '').replace(/\s+/g, ' ').trim()
  if (!cleaned) return description.trim()
  return /[。！？.!?…]$/.test(cleaned) ? cleaned : `${cleaned}。`
}

function assertCategory(c: string): asserts c is ToolCategory {
  const allowed: ToolCategory[] = [
    'crypto',
    'converter',
    'web',
    'media',
    'development',
    'network',
    'math',
    'measurement',
    'text',
    'data',
    'address',
  ]
  if (!allowed.includes(c as ToolCategory)) {
    throw new Error(`Invalid tool category: ${c}`)
  }
}

const ACRONYM_TOKENS = new Set([
  'api',
  'ascii',
  'cidr',
  'cpu',
  'crc',
  'css',
  'csv',
  'dns',
  'gif',
  'hmac',
  'html',
  'http',
  'https',
  'iban',
  'ico',
  'ip',
  'ipv4',
  'ipv6',
  'iso',
  'jpg',
  'json',
  'jsonl',
  'jsx',
  'jwt',
  'md5',
  'mime',
  'ndjson',
  'og',
  'otp',
  'pdf',
  'pem',
  'png',
  'px',
  'qr',
  'rc4',
  'rem',
  'rgb',
  'rsa',
  'sha1',
  'sha224',
  'sha256',
  'sha384',
  'sha3',
  'sha512',
  'sql',
  'svg',
  'toml',
  'tsv',
  'txt',
  'ua',
  'ubb',
  'ulid',
  'url',
  'us',
  'utf',
  'uuid',
  'webp',
  'wifi',
  'xml',
  'xpath',
  'yaml',
  'zip',
])

const CATEGORY_DESCRIPTION_EN: Record<ToolCategory, string> = {
  crypto: 'Generate, hash, encrypt, decode, and validate security-related data in your browser.',
  converter: 'Convert data formats and text representations quickly in your browser.',
  web: 'Inspect, encode, parse, and debug common web payloads and browser-side data.',
  media: 'Process images and media assets with lightweight browser tools.',
  development: 'Speed up development with formatters, generators, and debugging helpers.',
  network: 'Inspect network values, addresses, and protocol-related payloads.',
  math: 'Run quick math, percentage, and time-related calculations.',
  measurement: 'Convert units and compare measured values efficiently.',
  text: 'Transform, compare, and clean text for writing and development workflows.',
  data: 'Parse, validate, and convert structured data in common formats.',
  address: 'Generate sample address data for testing and demos.',
}

function humanizeToken(token: string): string {
  const lower = token.toLowerCase()
  if (ACRONYM_TOKENS.has(lower)) return lower.toUpperCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map(humanizeToken)
    .join(' ')
}

function toEnglishTool(row: ToolDefinition): ToolDefinition {
  const title = humanizeSlug(row.slug)
  return {
    slug: row.slug,
    category: row.category,
    title,
    description: CATEGORY_DESCRIPTION_EN[row.category],
  }
}

function normalizeCatalogRows(rows: ToolDefinition[]): ToolDefinition[] {
  return rows.map((row) => {
    assertCategory(row.category)
    return { ...row, description: sanitizeToolDescription(row.description) }
  })
}

const mainToolsZh = normalizeCatalogRows(catalog as ToolDefinition[])
const imageSeoToolsZh = normalizeCatalogRows(catalogImageSeo as ToolDefinition[])

const mainToolsEn = mainToolsZh.map(toEnglishTool)
const imageSeoToolsEn = imageSeoToolsZh.map(toEnglishTool)

const TOOLS_BY_LOCALE: Record<Locale, ToolDefinition[]> = {
  zh: [...mainToolsZh, ...imageSeoToolsZh],
  en: [...mainToolsEn, ...imageSeoToolsEn],
}

const toolMapByLocale: Record<Locale, Map<string, ToolDefinition>> = {
  zh: new Map(TOOLS_BY_LOCALE.zh.map((t) => [t.slug, t])),
  en: new Map(TOOLS_BY_LOCALE.en.map((t) => [t.slug, t])),
}

/** 图片类 SEO 独立入口 slug（与 `catalog.image-seo.json` 一致） */
export const IMAGE_SEO_TOOL_SLUGS = new Set(imageSeoToolsZh.map((t) => t.slug))

/** Backward-compatible default export list (English-first). */
export const TOOLS: ToolDefinition[] = TOOLS_BY_LOCALE.en

export function getTools(locale: Locale = DEFAULT_LOCALE): ToolDefinition[] {
  return TOOLS_BY_LOCALE[locale]
}

export function getToolBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): ToolDefinition | undefined {
  return toolMapByLocale[locale].get(slug)
}

export function toolsInCategory(category: ToolCategory, locale: Locale = DEFAULT_LOCALE): ToolDefinition[] {
  return TOOLS_BY_LOCALE[locale].filter((t) => t.category === category)
}

export const TOOL_CATEGORIES_ORDER: ToolCategory[] = [
  'converter',
  'crypto',
  'web',
  'media',
  'development',
  'network',
  'math',
  'measurement',
  'text',
  'data',
  'address',
]
