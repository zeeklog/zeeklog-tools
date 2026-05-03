import type { Metadata } from 'next'
import { ToolsIndexContent } from '@/components/tools/ToolsIndexContent'
import { SITE_DOMAIN, SITE_NAME_ZH } from '@/config/site-brand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    absolute: `工具搜索 | ${SITE_NAME_ZH}`,
  },
  description: `${SITE_DOMAIN} 在线工具箱内按名称、简介或 slug 搜索站内工具。`,
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
}

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = (await searchParams) ?? {}
  const query = typeof sp.q === 'string' ? sp.q : ''

  return <ToolsIndexContent query={query} />
}
