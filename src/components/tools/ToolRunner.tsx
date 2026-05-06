'use client'

import dynamic from 'next/dynamic'
import type { Locale } from '@/lib/i18n'
import { ToolPlaceholder } from '@/components/tools/ToolPlaceholder'
import { TOOL_LAZY_MAP } from '@/components/tools/dynamic-tool-views'
import { ToolRouteLoading } from '@/components/tools/tool-route-loading'
import { ToolErrorBoundary } from '@/components/tools/ToolErrorBoundary'
import { ToolLocaleProvider } from '@/components/tools/tool-locale'
import { getToolBySlug, IMAGE_SEO_TOOL_SLUGS } from '@/lib/tools/registry'
import { isToolImplemented } from '@/lib/tools/implemented'

const LazyImageSeoToolView = dynamic(
  () => import('@/components/tools/impl/ImageSeoToolView').then((m) => ({ default: m.ImageSeoToolView })),
  { loading: ToolRouteLoading },
)

type ToolRunnerProps = {
  slug: string
  locale: Locale
}

export function ToolRunner({ slug, locale }: ToolRunnerProps) {
  if (!isToolImplemented(slug)) {
    return <ToolPlaceholder locale={locale} />
  }
  const meta = getToolBySlug(slug, locale)
  const toolTitle = meta?.title ?? slug

  if (IMAGE_SEO_TOOL_SLUGS.has(slug)) {
    return (
      <ToolLocaleProvider locale={locale}>
        <ToolErrorBoundary toolTitle={toolTitle}>
          <LazyImageSeoToolView slug={slug} />
        </ToolErrorBoundary>
      </ToolLocaleProvider>
    )
  }

  const LazyComp = TOOL_LAZY_MAP[slug]
  if (!LazyComp) {
    return <ToolPlaceholder locale={locale} />
  }
  return (
    <ToolLocaleProvider locale={locale}>
      <ToolErrorBoundary toolTitle={toolTitle}>
        <LazyComp />
      </ToolErrorBoundary>
    </ToolLocaleProvider>
  )
}
