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

export const TOOL_CATEGORY_LABEL: Record<ToolCategory, string> = {
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
}
