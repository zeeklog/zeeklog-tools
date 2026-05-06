import type { Locale } from '@/lib/i18n'

export type ToolCategory =
  | 'crypto'
  | 'converter'
  | 'web'
  | 'media'
  | 'development'
  | 'network'
  | 'math'
  | 'measurement'
  | 'text'
  | 'data'
  | 'address'

export type ToolDefinition = {
  slug: string
  category: ToolCategory
  title: string
  description: string
}

const TOOL_CATEGORY_LABELS: Record<Locale, Record<ToolCategory, string>> = {
  en: {
    crypto: 'Security',
    converter: 'Converters',
    web: 'Web',
    media: 'Media',
    development: 'Development',
    network: 'Network',
    math: 'Math',
    measurement: 'Measurement',
    text: 'Text',
    data: 'Data',
    address: 'Address Generators',
  },
  zh: {
    crypto: '加密',
    converter: '转换器',
    web: 'Web',
    media: '图片与视频',
    development: '开发',
    network: '网络',
    math: '数学',
    measurement: '测量',
    text: '文本',
    data: '数据',
    address: '地址生成器',
  },
}

export function getToolCategoryLabel(category: ToolCategory, locale: Locale): string {
  return TOOL_CATEGORY_LABELS[locale][category]
}
