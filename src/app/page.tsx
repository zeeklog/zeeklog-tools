import type { Metadata } from 'next'
import { ToolsIndexContent } from '@/components/tools/ToolsIndexContent'
import { t } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getSiteName, SITE_DOMAIN } from '@/config/site-brand'
import { getTools } from '@/lib/tools/registry'
import { getSiteBaseUrl, getToolsIndexKeywords } from '@/lib/tools/tool-page-seo'
import { serializeJsonLdForScript } from '@/lib/seo-utils'

function trimMetaDescription(s: string, max = 158): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const i18n = t(locale)
  const siteName = getSiteName(locale)
  const toolCount = getTools(locale).length
  const description = trimMetaDescription(`${SITE_DOMAIN} ${i18n.homeMetaDescription}`)

  return {
    title: {
      absolute: `${siteName} (${toolCount}+)`,
    },
    description,
    robots: { index: true, follow: true },
    keywords: getToolsIndexKeywords(locale),
    alternates: { canonical: '/' },
    openGraph: {
      title: `${siteName} | ${i18n.homeOgTitle}`,
      description,
      type: 'website',
      siteName,
      url: '/',
    },
    twitter: {
      card: 'summary',
      title: `${siteName} | ${i18n.homeOgTitle}`,
      description,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const locale = await getRequestLocale()
  const i18n = t(locale)
  const siteName = getSiteName(locale)
  const tools = getTools(locale)
  const site = getSiteBaseUrl()
  const homeCanonical = `${site}/`
  const homeDescription = trimMetaDescription(`${SITE_DOMAIN} ${i18n.homeMetaDescription}`)
  const cap = 24

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: siteName,
    description: homeDescription,
    url: homeCanonical,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: site,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, cap).map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        item: `${site}/tools/${tool.slug}`,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLdForScript(homeJsonLd) }} />
      <ToolsIndexContent locale={locale} />
    </>
  )
}
