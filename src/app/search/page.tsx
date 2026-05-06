import type { Metadata } from 'next'
import { ToolsIndexContent } from '@/components/tools/ToolsIndexContent'
import { t } from '@/lib/i18n'
import { SITE_DOMAIN } from '@/config/site-brand'
import { getRequestLocale } from '@/lib/request-locale'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const i18n = t(locale)
  return {
    title: {
      absolute: `${i18n.searchMetaTitle} | ${i18n.siteName}`,
    },
    description: `${SITE_DOMAIN} ${i18n.searchMetaDescription}`,
    robots: { index: false, follow: true },
    alternates: { canonical: '/search' },
  }
}

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = await getRequestLocale()
  const sp = (await searchParams) ?? {}
  const query = typeof sp.q === 'string' ? sp.q : ''

  return <ToolsIndexContent query={query} locale={locale} />
}
