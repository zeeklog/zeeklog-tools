'use client'

import dynamic from 'next/dynamic'
import { ToolPlaceholder } from '@/components/tools/ToolPlaceholder'
import { TOOL_LAZY_MAP } from '@/components/tools/dynamic-tool-views'
import { ToolRouteLoading } from '@/components/tools/tool-route-loading'
import { ToolErrorBoundary } from '@/components/tools/ToolErrorBoundary'
import { getToolBySlug, IMAGE_SEO_TOOL_SLUGS } from '@/lib/tools/registry'
import { isToolImplemented } from '@/lib/tools/implemented'

const LazyImageSeoToolView = dynamic(
  () => import('@/components/tools/impl/ImageSeoToolView').then((m) => ({ default: m.ImageSeoToolView })),
  { loading: ToolRouteLoading },
)

type ToolRunnerProps = {
  slug: string
}

export function ToolRunner({ slug }: ToolRunnerProps) {
  if (!isToolImplemented(slug)) {
    return <ToolPlaceholder />
  }
  const meta = getToolBySlug(slug)
  const toolTitle = meta?.title ?? slug

  if (IMAGE_SEO_TOOL_SLUGS.has(slug)) {
    return (
      <ToolErrorBoundary toolTitle={toolTitle}>
        <LazyImageSeoToolView slug={slug} />
      </ToolErrorBoundary>
    )
  }

  const LazyComp = TOOL_LAZY_MAP[slug]
  if (!LazyComp) {
    return <ToolPlaceholder />
  }
  return (
    <ToolErrorBoundary toolTitle={toolTitle}>
      <LazyComp />
    </ToolErrorBoundary>
  )
}
