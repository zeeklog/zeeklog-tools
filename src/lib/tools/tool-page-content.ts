import type { Locale } from '@/lib/i18n'
import type { ToolDefinition } from '@/lib/tools/types'
import { getToolCategoryLabel } from '@/lib/tools/types'
import { getSiteName } from '@/config/site-brand'

export type ToolFaqItem = { question: string; answer: string }

const CATEGORY_SCENARIO: Record<Locale, Record<ToolDefinition['category'], string>> = {
  en: {
    crypto: 'key handling, hashing, signing, and safe data checks',
    converter: 'format conversion and cross-system data transformation',
    web: 'frontend payload cleanup and HTTP debugging tasks',
    media: 'asset preparation and lightweight media processing',
    development: 'code formatting and engineering workflow support',
    network: 'address planning and network diagnostics',
    math: 'quick calculations for docs, analysis, and engineering tasks',
    measurement: 'unit conversion and timing/performance comparisons',
    text: 'content cleanup, restructuring, and writing workflows',
    data: 'structured data parsing, validation, and format exchange',
    address: 'test data generation for address-based forms and demos',
  },
  zh: {
    crypto: '密钥与数据完整性校验、接口签名与本地脱敏验证',
    converter: '多格式互转、配置迁移与跨系统数据对齐',
    web: '前端页面处理、HTTP 调试与 HTML/URL 相关整理',
    media: '素材生成、轻量预览与多媒体配置辅助',
    development: '代码与配置格式化、仓库脚本与工程文档整理',
    network: '地址规划、DNS/协议排查与网络侧数据对照',
    math: '数值推导、比例换算与课堂/技术写作中的算式与比例展示',
    measurement: '单位换算、耗时统计与简易性能对比',
    text: '长文本处理、排版清洗与内容生产提效',
    data: '结构化数据查看、表格/序列化格式处理与校验',
    address: '批量生成不同国家与地区的示例地址，用于测试、演示与数据填充',
  },
}

export function buildToolLongIntro(tool: ToolDefinition, featureKeywords: string[], locale: Locale): string {
  const category = getToolCategoryLabel(tool.category, locale)
  const siteName = getSiteName(locale)
  const scenario = CATEGORY_SCENARIO[locale][tool.category]
  const featureList = featureKeywords.filter(Boolean).slice(0, 4).join(locale === 'en' ? '; ' : '；')

  if (locale === 'zh') {
    return `「${tool.title}」收录于 ${siteName} 的「${category}」分类，${tool.description}该工具适用于${scenario}。核心能力包括：${featureList || '输入处理、结果展示与复制复用'}。在整理文档、联调接口、准备演示或排查问题时，你可以把它与站内相邻工具串联使用，形成更顺滑的处理链路。涉及敏感数据时，请先脱敏并在合规环境中使用。`
  }

  return `${tool.title} is part of the ${category} section in ${siteName}. It is designed for ${scenario}. Key capabilities include: ${featureList || 'focused input handling, clear output preview, and easy reuse'}. You can combine this page with nearby tools to complete multi-step workflows such as debugging, documentation prep, and data transformation. For sensitive data, always review security requirements before use.`
}

export function buildToolFaqEntries(tool: ToolDefinition, locale: Locale): ToolFaqItem[] {
  const category = getToolCategoryLabel(tool.category, locale)
  const scenario = CATEGORY_SCENARIO[locale][tool.category]
  if (locale === 'zh') {
    return [
      {
        question: `「${tool.title}」适合哪些典型场景？`,
        answer: `适合${scenario}等与「${category}」相关的日常工作，也常用于联调、文档示例与教学场景。`,
      },
      {
        question: '处理结果可以继续复制或用于后续步骤吗？',
        answer: '可以。多数工具会直接在页面内给出结果，便于复制到文档、脚本或下一步工具继续使用。',
      },
      {
        question: '输入的内容会上传到服务器吗？',
        answer: '多数工具在浏览器本地完成处理；如需服务端能力，页面会给出说明。请勿处理未脱敏的机密数据。',
      },
    ]
  }

  return [
    {
      question: `When is "${tool.title}" most useful?`,
      answer: `It fits daily ${category.toLowerCase()} workflows, especially for ${scenario}.`,
    },
    {
      question: 'Can I reuse the output in later steps?',
      answer: 'Yes. Most tools present copy-ready output so you can continue in docs, scripts, configs, or another tool.',
    },
    {
      question: 'Is input data uploaded to a server?',
      answer: 'Most tools run locally in the browser. Server-backed tools are marked clearly. Avoid using raw sensitive data.',
    },
  ]
}
