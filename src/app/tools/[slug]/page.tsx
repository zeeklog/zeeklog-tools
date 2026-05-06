import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { t } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { ToolShell } from '@/components/tools/ToolShell'
import { ToolRunner } from '@/components/tools/ToolRunner'
import { getToolBySlug, getTools } from '@/lib/tools/registry'
import { buildToolFaqEntries, buildToolLongIntro } from '@/lib/tools/tool-page-content'
import {
  getToolFeatureKeywords,
  getToolMetaDescription,
  getToolPageMetadata,
} from '@/lib/tools/tool-page-seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

/** 构建期预渲染全部工具详情路由，加快首屏与客户端导航时的 RSC 响应 */
export function generateStaticParams() {
  return getTools('en').map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getRequestLocale()
  const i18n = t(locale)
  const { slug } = await params
  const tool = getToolBySlug(slug, locale)
  if (!tool) {
    return { title: `${i18n.notFoundMetaTitle} | ${i18n.siteName}`, robots: { index: false, follow: true } }
  }
  return getToolPageMetadata(tool, locale)
}

export default async function ToolDetailPage({ params }: PageProps) {
  const locale = await getRequestLocale()
  const { slug } = await params
  const tool = getToolBySlug(slug, locale)
  if (!tool) {
    notFound()
    return null
  }
  const resolvedTool = tool
  const featureKeywords = getToolFeatureKeywords(resolvedTool, locale)

  return (
    <ToolShell
      tool={resolvedTool}
      metaDescription={getToolMetaDescription(resolvedTool, locale)}
      longIntro={buildToolLongIntro(resolvedTool, featureKeywords, locale)}
      faq={buildToolFaqEntries(resolvedTool, locale)}
      featureKeywords={featureKeywords}
      currentSlug={slug}
      locale={locale}
    >
      <ToolRunner slug={slug} locale={locale} />
    </ToolShell>
  )
}
