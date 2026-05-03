import type { Metadata } from 'next'
import catalog from '@/lib/tools/catalog.json'
import { ToolsIndexContent } from '@/components/tools/ToolsIndexContent'
import { getSiteBaseUrl, getToolsIndexKeywords } from '@/lib/tools/tool-page-seo'
import { serializeJsonLdForScript } from '@/lib/seo-utils'
import { SITE_DOMAIN, SITE_NAME_ZH } from '@/config/site-brand'

function trimMetaDescription(s: string, max = 158): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`
}

const homeCanonical = `${getSiteBaseUrl()}/`
const homeDescriptionRaw = `${SITE_DOMAIN} 在线工具箱收录 ${catalog.length} 个常用工具，覆盖格式转换、编码解码、文本处理、网络诊断与图片辅助等常见场景。`
const homeDescription = trimMetaDescription(homeDescriptionRaw)

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME_ZH}（${catalog.length}+）｜格式转换、编码解码、文本处理与开发辅助`,
  },
  description: homeDescription,
  robots: { index: true, follow: true },
  keywords: getToolsIndexKeywords(),
  alternates: { canonical: '/' },
  openGraph: {
    title: `${SITE_NAME_ZH} | 常用工具首页`,
    description: `${SITE_DOMAIN} 在线工具箱，按分类整理常用格式转换、编码解码、文本处理、网络诊断与图片辅助工具。`,
    type: 'website',
    siteName: SITE_NAME_ZH,
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME_ZH} | 常用工具首页`,
    description: `${SITE_DOMAIN} 在线工具箱，常用格式转换、编码解码、文本处理、网络诊断与图片辅助工具集合。`,
  },
}

function homeJsonLd() {
  const site = getSiteBaseUrl()
  const cap = 24
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: SITE_NAME_ZH,
    description: homeDescription,
    url: homeCanonical,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME_ZH,
      url: site,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: catalog.length,
      itemListElement: catalog.slice(0, cap).map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        item: `${site}/tools/${t.slug}`,
      })),
    },
  }
}

const HOME_JSON_LD = homeJsonLd()

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLdForScript(HOME_JSON_LD) }} />
      <ToolsIndexContent />
    </>
  )
}
