import type { ToolCategory, ToolDefinition } from '@/lib/tools/types'
import { TOOL_CATEGORY_LABEL } from '@/lib/tools/types'
import { SITE_NAME_ZH } from '@/config/site-brand'

/** 用于 meta / 首行摘要的场景短语（与分类绑定，减少全文重复感） */
const CATEGORY_SCENARIO: Record<ToolCategory, string> = {
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
}

export type ToolFaqItem = { question: string; answer: string }

function unicodeCharCount(s: string): number {
  return [...s].length
}

/**
 * 约 200–300 汉字（Unicode 码点）的独特介绍，融合标题、简介、分类场景与功能要点，避免与 meta 完全雷同。
 */
export function buildToolLongIntro(tool: ToolDefinition, featureKeywords: string[]): string {
  const cat = TOOL_CATEGORY_LABEL[tool.category]
  const scenario = CATEGORY_SCENARIO[tool.category]
  const bits = featureKeywords
    .filter(Boolean)
    .slice(0, 5)
    .map((k) => k.replace(/。$/, ''))
  const feat =
    bits.length > 0
      ? `围绕真实任务，本页功能侧重点包括：${bits.join('；')}。`
      : '您可在下方表单中按页面提示完成输入与输出；如需重复执行同类任务，可将本页加入书签以便随时返回。'

  let body = [
    `「${tool.title}」收录于 ${SITE_NAME_ZH}的「${cat}」分类，${tool.description.trim()}`,
    `在互联网产品与研发协作中，它适用于${scenario}。`,
    feat,
    '页面提供聚焦的输入、处理与结果查看流程，适合在整理文档、校验示例、联调接口或准备演示材料时快速完成当前步骤。',
    `若你在同一需求链路中还需要相邻步骤（例如编码、压缩或导出），可通过本页底部的分类内链继续跳转到其他工具，形成可检索、可分享的站内路径。`,
    `涉及凭据、个人隐私或受监管数据时，请先完成脱敏或在合规环境中评估后再使用任何在线工具。`,
  ].join('')

  let n = unicodeCharCount(body)
  if (n < 200) {
    body += ` ${SITE_NAME_ZH}持续整理这类常用工具，方便在排障、写文档与准备示例时减少切换成本。`
    n = unicodeCharCount(body)
  }
  if (n > 300) {
    body = [...body].slice(0, 299).join('') + '…'
  }
  return body
}

export function buildToolFaqEntries(tool: ToolDefinition): ToolFaqItem[] {
  const cat = TOOL_CATEGORY_LABEL[tool.category]
  const scenario = CATEGORY_SCENARIO[tool.category]
  return [
    {
      question: `「${tool.title}」适合哪些典型场景？`,
      answer: `适合${scenario}等与「${cat}」相关的日常工作；也常用于联调、文档示例与教学场景，帮助快速得到可复制的输出结果。`,
    },
    {
      question: `处理结果可以继续复制或用于后续步骤吗？`,
      answer: '可以。多数工具会直接在页面内给出结果，便于复制到文档、脚本、配置文件或下一步工具处理中继续使用。',
    },
    {
      question: '输入的内容会上传到服务器吗？',
      answer:
        '多数工具在您的浏览器本地完成计算与展示；若某项能力必须依赖服务端（例如部分网络类查询），页面会单独说明请求走向。请勿在不可信网络环境下处理未脱敏的机密数据。',
    },
  ]
}
