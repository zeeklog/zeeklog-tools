'use client'

import dynamic from 'next/dynamic'
import { ToolPlaceholder } from '@/components/tools/ToolPlaceholder'
import { ToolRouteLoading } from '@/components/tools/tool-route-loading'
import {
  formatLabelForSlug,
  matrixTargetToServerFormat,
  parseMatrixSlug,
} from '@/lib/tools/image-seo-presets'

const LazyImageConverterHubTool = dynamic(
  () => import('./ImageConverterHubTool').then((m) => ({ default: m.ImageConverterHubTool })),
  { loading: ToolRouteLoading },
)
const LazyBitmapImageSuiteTool = dynamic(
  () => import('./BitmapImageSuiteTool').then((m) => ({ default: m.BitmapImageSuiteTool })),
  { loading: ToolRouteLoading },
)
const LazyPdfToImageTool = dynamic(
  () => import('./PdfToImageTool').then((m) => ({ default: m.PdfToImageTool })),
  { loading: ToolRouteLoading },
)
const LazyImageDataUriHelperTool = dynamic(
  () => import('./ImageDataUriHelperTool').then((m) => ({ default: m.ImageDataUriHelperTool })),
  { loading: ToolRouteLoading },
)
const LazyImageLsbSteganographyTool = dynamic(
  () => import('./ImageLsbSteganographyTool').then((m) => ({ default: m.ImageLsbSteganographyTool })),
  { loading: ToolRouteLoading },
)
const LazyFaviconIcoGeneratorTool = dynamic(
  () => import('./FaviconIcoGeneratorTool').then((m) => ({ default: m.FaviconIcoGeneratorTool })),
  { loading: ToolRouteLoading },
)
const LazyServerRasterImageConverterTool = dynamic(
  () => import('./ServerRasterImageConverterTool').then((m) => ({ default: m.ServerRasterImageConverterTool })),
  { loading: ToolRouteLoading },
)

export type ImageSeoToolViewProps = {
  slug: string
}

/**
 * 图片类 SEO 独立入口：按 slug 挂载已有实现并设置初始格式/模式（与 `catalog.image-seo.json` 一致）。
 * 各实现按需动态加载，避免与全站工具大包捆绑。
 */
export function ImageSeoToolView({ slug }: ImageSeoToolViewProps) {
  if (slug === 'image-converter-hub') {
    return <LazyImageConverterHubTool />
  }
  if (slug === 'jpg-to-png') {
    return <LazyBitmapImageSuiteTool initialMode="jpg-png" />
  }
  if (slug === 'png-to-jpg') {
    return <LazyBitmapImageSuiteTool initialMode="png-jpg" />
  }
  if (slug === 'bmp-to-jpg') {
    return <LazyBitmapImageSuiteTool initialMode="bmp-jpg" />
  }
  if (slug === 'rounded-corner-image') {
    return <LazyBitmapImageSuiteTool initialMode="rounded" />
  }
  if (slug === 'pdf-to-jpg') {
    return <LazyPdfToImageTool initialMime="image/jpeg" />
  }
  if (slug === 'pdf-to-png') {
    return <LazyPdfToImageTool initialMime="image/png" />
  }
  if (slug === 'image-to-base64') {
    return <LazyImageDataUriHelperTool initialSection="encode" />
  }
  if (slug === 'base64-to-image') {
    return <LazyImageDataUriHelperTool initialSection="decode" />
  }
  if (slug === 'image-encode') {
    return <LazyImageLsbSteganographyTool initialTab="encode" />
  }
  if (slug === 'image-decoder') {
    return <LazyImageLsbSteganographyTool initialTab="decode" />
  }
  if (slug === 'favicon' || slug === 'favicon-generator') {
    return <LazyFaviconIcoGeneratorTool />
  }

  const matrix = parseMatrixSlug(slug)
  if (matrix) {
    const { format, fallbackFromMatrix } = matrixTargetToServerFormat(matrix.to)
    return (
      <LazyServerRasterImageConverterTool
        initialTargetFormat={format}
        matrixFromLabel={formatLabelForSlug(matrix.from)}
        matrixToLabel={formatLabelForSlug(matrix.to)}
        showMatrixFallbackBanner={fallbackFromMatrix}
      />
    )
  }

  return <ToolPlaceholder />
}
