import type { Metadata } from 'next'
import type { ToolDefinition } from './types'
import { TOOL_CATEGORY_LABEL } from './types'
import { imageSeoFeatureKeywords } from './image-seo-presets'
import toolSlugSeo from './tool-slug-seo.json'
import type { ToolFaqItem } from '@/lib/tools/tool-page-content'
import { SITE_DOMAIN, SITE_NAME_ZH } from '@/config/site-brand'
import { siteOrigin } from '@/lib/site-url'

type SeoEntry = { keywords: string[]; metaDescription: string }

const seoMap = toolSlugSeo as Record<string, SeoEntry>
const SEO_COPY_TAIL =
  /在\s*极客日志（zeeklog\.com）在线工具箱可免费使用：浏览器内即开即用，适合日常开发、联调、文档与运维场景。\s*$/i
const LEGACY_SEO_TAIL = /\s*在线工具，[^。！？]*online\s*$/i
const DISALLOWED_KEYWORDS = new Set(['免费在线', '无需安装', '网页版', 'IT工具'])
const GENERIC_FEATURE_KEYWORDS = new Set(['在线工具', '开发者工具', '工具箱', SITE_NAME_ZH])

function cleanSeoText(raw: string): string {
  return raw
    .replace(SEO_COPY_TAIL, '')
    .replace(LEGACY_SEO_TAIL, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeKeywords(keywords: string[]): string[] {
  return [...new Set(
    keywords
      .map((keyword) => cleanSeoText(keyword).replace(/\s+/g, ' ').trim())
      .filter((keyword) => keyword && !DISALLOWED_KEYWORDS.has(keyword))
  )]
}

function isDisplayFeatureKeyword(keyword: string, tool: ToolDefinition): boolean {
  const compact = keyword.replace(/\s+/g, '').toLowerCase()
  const title = tool.title.replace(/\s+/g, '').toLowerCase()

  if (!keyword) return false
  if (GENERIC_FEATURE_KEYWORDS.has(keyword)) return false
  if (keyword.includes('在线')) return false
  if (/极客日志|zeeklog\.com/i.test(keyword)) return false
  if (compact === title) return false
  if (compact === `${title}工具`) return false
  if (compact === `${title}在线`) return false
  if (compact === `在线${title}`) return false

  return true
}

const extraSeoMap: Record<string, SeoEntry> = {
  'us-address-generator': {
    keywords: ['随机美国地址生成器', '美国地址', 'US Address Generator', '邮政编码', '街道地址', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成美国地址，包括街道、城市、州与邮编，支持数量快捷选择、显示全部与下载。',
  },
  'uk-address-generator': {
    keywords: ['随机英国地址生成器', '英国地址', 'UK Address Generator', 'postcode', 'county', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成英国地址，包括门牌、街道、城市、郡与邮编，支持数量快捷选择、显示全部与下载。',
  },
  'hk-address-generator': {
    keywords: ['随机香港地址生成器', '香港地址', 'Hong Kong Address Generator', '大厦楼层', '区域', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成香港地址，包括单位楼层、大厦、街道与区域，支持数量快捷选择、显示全部与下载。',
  },
  'sg-address-generator': {
    keywords: ['随机新加坡地址生成器', '新加坡地址', 'Singapore Address Generator', 'HDB', '邮政编码', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成新加坡地址，包括组屋单位、街道、区域与邮编，支持数量快捷选择、显示全部与下载。',
  },
  'california-address-generator': {
    keywords: ['随机加州地址生成器', '加州地址', 'California Address Generator', 'CA zip code', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成加州地址，包括街道、城市、州 CA 与邮编，支持数量快捷选择、显示全部与下载。',
  },
  'newzealand-address-generator': {
    keywords: ['随机新西兰地址生成器', '新西兰地址', 'New Zealand Address Generator', '北岛', '南岛', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成新西兰地址，支持北岛/南岛筛选，支持数量快捷选择、显示全部与下载。',
  },
  'spain-address-generator': {
    keywords: ['随机西班牙地址生成器', '西班牙地址', 'Spain Address Generator', '马德里', '加泰罗尼亚', '在线工具', SITE_NAME_ZH],
    metaDescription: '随机生成西班牙地址，支持马德里、加泰罗尼亚、安达卢西亚、瓦伦西亚筛选，并支持下载。',
  },
  'gemini-watermark-remover': {
    keywords: [
      'Gemini 图片去水印',
      'Gemini watermark remover',
      'Nano Banana 去水印',
      '图片去水印',
      '反向 Alpha 混合',
      '批量去水印',
      '在线工具',
      SITE_NAME_ZH,
    ],
    metaDescription:
      '基于开源 gemini-watermark-remover 的 Gemini/Nano Banana 图片去水印工具，支持 JPG、PNG、WebP 批量处理与下载。',
  },
}

const META_TAIL = `来自${SITE_NAME_ZH}（${SITE_DOMAIN}）。`

function unicodeLen(s: string): number {
  return [...s].length
}

function stripSeoJsonTail(raw: string): string {
  return cleanSeoText(raw)
}

export function getToolMetaDescription(tool: ToolDefinition): string {
  const entry = extraSeoMap[tool.slug] ?? seoMap[tool.slug]
  const cat = TOOL_CATEGORY_LABEL[tool.category]
  const rawCore = stripSeoJsonTail(entry?.metaDescription ?? tool.description)
  let core =
    rawCore ||
    `${tool.title}为 ${SITE_NAME_ZH}中的${cat}工具，便于快速处理输入内容并核对结果。`
  if (!/[。！？…]$/.test(core)) core += '。'

  const scenario = `适用于${cat}相关场景与日常排障。`
  const glue = `${META_TAIL}`
  const maxTotal = 150

  const fitCore = (c: string) => {
    const tail = `${scenario}${glue}`
    const need = unicodeLen(tail)
    let out = c
    if (unicodeLen(out) + need > maxTotal) {
      const cap = Math.max(28, maxTotal - need - 1)
      out = [...c].slice(0, cap).join('').trim()
      if (!/[。！？…]$/.test(out)) out += '…'
    }
    return `${out}${tail}`.replace(/\s+/g, ' ').trim()
  }

  let s = fitCore(core)
  if (unicodeLen(s) < 80) {
    core = `${tool.title}支持${cat}方向的常见处理任务，适合文档整理、示例生成与联调对照。`
    if (!/[。！？…]$/.test(core)) core += '。'
    s = fitCore(core)
  }
  if (!new RegExp(SITE_NAME_ZH).test(s)) {
    s = `${s} ${META_TAIL}`.replace(/\s+/g, ' ').trim()
  }
  if (unicodeLen(s) > maxTotal) {
    s = [...s].slice(0, maxTotal - 1).join('') + '…'
  }
  return s
}

export function getSiteBaseUrl(): string {
  return siteOrigin()
}

/** 详情页正文区列表展示用（优先保留对用户有意义的功能词，而不是 SEO 泛词） */
export function getToolFeatureKeywords(tool: ToolDefinition): string[] {
  const entry = extraSeoMap[tool.slug] ?? seoMap[tool.slug]
  if (entry?.keywords?.length) {
    const picked = sanitizeKeywords(entry.keywords).filter((keyword) => isDisplayFeatureKeyword(keyword, tool))
    if (picked.length) return picked.slice(0, 10)
  }
  const imgKw = imageSeoFeatureKeywords(tool.slug)
  if (imgKw?.length) {
    const picked = sanitizeKeywords(imgKw).filter((keyword) => isDisplayFeatureKeyword(keyword, tool))
    if (picked.length) return picked.slice(0, 10)
  }
  return [
    '聚焦当前格式化、转换、计算或生成任务',
    '支持结果复制、校验或导出',
    '适合开发、排障与文档整理',
    '可与站内其他工具组合使用',
  ]
}

/**
 * SoftwareApplication + FAQPage，合并为 @graph，贴合富结果与 FAQ 展示。
 * schema 描述可使用较长文案（页面独特介绍截断），与 meta description 区分以降低重复感。
 */
export function getToolStructuredDataGraph(params: {
  tool: ToolDefinition
  metaDescription: string
  schemaDescription: string
  pageUrl: string
  faq: ToolFaqItem[]
}): Record<string, unknown> {
  const { tool, metaDescription, schemaDescription, pageUrl, faq } = params
  const desc = `${schemaDescription} ${metaDescription}`.replace(/\s+/g, ' ').trim()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.title,
        description: [...desc].slice(0, 500).join(''),
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        url: pageUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  }
}

export function getToolPageMetadata(tool: ToolDefinition): Metadata {
  const entry = extraSeoMap[tool.slug] ?? seoMap[tool.slug]
  const description = getToolMetaDescription(tool)
  const keywords = sanitizeKeywords(entry?.keywords ?? [tool.title, '在线工具', TOOL_CATEGORY_LABEL[tool.category], SITE_NAME_ZH])
  const canonicalPath = `/tools/${tool.slug}`

  return {
    title: {
      absolute: `${tool.title} | ${TOOL_CATEGORY_LABEL[tool.category]}工具 · ${SITE_NAME_ZH}`,
    },
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${tool.title} | ${SITE_NAME_ZH}`,
      description,
      type: 'website',
      url: canonicalPath,
      siteName: SITE_NAME_ZH,
    },
    twitter: {
      card: 'summary',
      title: `${tool.title} | ${SITE_NAME_ZH}`,
      description,
    },
    robots: { index: true, follow: true },
  }
}

export function getToolsIndexKeywords(): string[] {
  return [
    '在线工具箱',
    '开发工具',
    '格式转换',
    '编码解码',
    '文本处理',
    '网络诊断',
    '图片处理',
    'JSON 工具',
    '二维码生成',
    'URL 编码',
    SITE_DOMAIN,
    SITE_NAME_ZH,
  ]
}
