import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { getSiteName, SITE_DOMAIN } from '@/config/site-brand'
import { t } from '@/lib/i18n'
import { siteOrigin } from '@/lib/site-url'
import type { ToolFaqItem } from '@/lib/tools/tool-page-content'
import type { ToolDefinition } from '@/lib/tools/types'
import { getToolCategoryLabel } from '@/lib/tools/types'

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

export function getToolMetaDescription(tool: ToolDefinition, locale: Locale): string {
  const category = getToolCategoryLabel(tool.category, locale)
  if (locale === 'zh') {
    return `${tool.title}（${category}）在线工具，适合快速处理输入内容并核对结果。来自 ${getSiteName(locale)}（${SITE_DOMAIN}）。`
  }
  return `${tool.title} is an online ${category.toLowerCase()} tool for quick input processing and output validation in your browser.`
}

export function getSiteBaseUrl(): string {
  return siteOrigin()
}

export function getToolFeatureKeywords(tool: ToolDefinition, locale: Locale): string[] {
  const category = getToolCategoryLabel(tool.category, locale)
  if (locale === 'zh') {
    return [
      `${category}场景`,
      '浏览器内处理',
      '可复制结果',
      '联调与文档支持',
    ]
  }
  return [
    `${category} workflow`,
    'Browser-based processing',
    'Copy-ready output',
    'Helpful for debugging and docs',
  ]
}

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
          priceCurrency: 'USD',
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

export function getToolPageMetadata(tool: ToolDefinition, locale: Locale): Metadata {
  const i18n = t(locale)
  const description = getToolMetaDescription(tool, locale)
  const category = getToolCategoryLabel(tool.category, locale)
  const siteName = getSiteName(locale)
  const canonicalPath = `/tools/${tool.slug}`
  const keywords = dedupe([
    tool.title,
    category,
    locale === 'zh' ? '在线工具' : 'online tools',
    locale === 'zh' ? '开发者工具' : 'developer tools',
    SITE_DOMAIN,
    siteName,
  ])

  return {
    title: {
      absolute: `${tool.title} | ${siteName}`,
    },
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${tool.title} | ${siteName}`,
      description,
      type: 'website',
      url: canonicalPath,
      siteName,
    },
    twitter: {
      card: 'summary',
      title: `${tool.title} | ${siteName}`,
      description,
    },
    robots: { index: true, follow: true },
  }
}

export function getToolsIndexKeywords(locale: Locale): string[] {
  const siteName = getSiteName(locale)
  const i18n = t(locale)
  if (locale === 'zh') {
    return dedupe(['在线工具箱', '开发工具', '格式转换', '编码解码', '文本处理', SITE_DOMAIN, siteName])
  }
  return dedupe(['online toolkit', 'developer tools', 'format conversion', 'text processing', 'encoding', SITE_DOMAIN, siteName, i18n.toolsHeading])
}
