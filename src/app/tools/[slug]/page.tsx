import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ToolShell } from '@/components/tools/ToolShell'
import { ToolRunner } from '@/components/tools/ToolRunner'
import { getToolBySlug, TOOLS } from '@/lib/tools/registry'
import { buildToolFaqEntries, buildToolLongIntro } from '@/lib/tools/tool-page-content'
import {
  getToolFeatureKeywords,
  getToolMetaDescription,
  getToolPageMetadata,
} from '@/lib/tools/tool-page-seo'
import { SITE_NAME_ZH } from '@/config/site-brand'

type PageProps = {
  params: Promise<{ slug: string }>
}

/** 构建期预渲染全部工具详情路由，加快首屏与客户端导航时的 RSC 响应 */
export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) {
    return { title: `未找到工具 | ${SITE_NAME_ZH}`, robots: { index: false, follow: true } }
  }
  return getToolPageMetadata(tool)
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) {
    notFound()
    return null
  }
  const resolvedTool = tool
  const featureKeywords = getToolFeatureKeywords(resolvedTool)

  return (
    <ToolShell
      tool={resolvedTool}
      metaDescription={getToolMetaDescription(resolvedTool)}
      longIntro={buildToolLongIntro(resolvedTool, featureKeywords)}
      faq={buildToolFaqEntries(resolvedTool)}
      featureKeywords={featureKeywords}
      currentSlug={slug}
    >
      <ToolRunner slug={slug} />
    </ToolShell>
  )
}
