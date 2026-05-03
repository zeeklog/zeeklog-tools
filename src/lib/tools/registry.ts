import catalog from './catalog.json'
import catalogImageSeo from './catalog.image-seo.json'
import type { ToolCategory, ToolDefinition } from './types'

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

const mainTools: ToolDefinition[] = (catalog as ToolDefinition[]).map((row) => {
  assertCategory(row.category)
  return { ...row, description: sanitizeToolDescription(row.description) }
})

const imageSeoTools: ToolDefinition[] = (catalogImageSeo as ToolDefinition[]).map((row) => {
  assertCategory(row.category)
  return { ...row, description: sanitizeToolDescription(row.description) }
})

/** 图片类 SEO 独立入口 slug（与 `catalog.image-seo.json` 一致） */
export const IMAGE_SEO_TOOL_SLUGS = new Set(imageSeoTools.map((t) => t.slug))

export const TOOLS: ToolDefinition[] = [...mainTools, ...imageSeoTools]

const bySlug = new Map(TOOLS.map((t) => [t.slug, t]))

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return bySlug.get(slug)
}

export function toolsInCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category)
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
