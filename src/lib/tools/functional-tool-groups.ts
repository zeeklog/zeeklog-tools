import type { ToolDefinition } from '@/lib/tools/types'
import type { Locale } from '@/lib/i18n'

export type FunctionalGroup = {
  id: string
  title: string
  pick: (tool: ToolDefinition) => boolean
}

type FunctionalGroupTemplate = {
  id: string
  title: Record<Locale, string>
  pick: (tool: ToolDefinition) => boolean
}

/** 与 `ToolsIndexContent` 中分组逻辑一致；最后一组承接其余全部工具 */
const FUNCTIONAL_GROUPS_TEMPLATE: FunctionalGroupTemplate[] = [
  {
    id: 'address-generators',
    title: { en: 'Address Generators', zh: '地址生成器' },
    pick: (tool) => tool.category === 'address',
  },
  {
    id: 'serialization-and-data-exchange',
    title: { en: 'Serialization & Data Exchange', zh: '数据序列化与交换' },
    pick: (tool) =>
      [
        'json-',
        'yaml-',
        'toml-',
        'xml-',
        'csv-',
        'sql-to-data-formats',
        'tabular-spreadsheet-converter',
        'structured-data-viewer',
        'jsonpath-tester',
        'xpath-tester',
        'html-table-tools',
        'chart-from-csv',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'encoding-and-escaping',
    title: { en: 'Encoding, Escaping & Content Conversion', zh: '编码、转义与内容转换' },
    pick: (tool) =>
      [
        'base64',
        'encoding-toolkit',
        'url-encoder',
        'html-entities',
        'escape-native-converter',
        'utf-8-inspector',
        'text-to-',
        'html-js-literal-converter',
        'html-to-markdown',
        'markdown-to-html',
        'html-to-jsx',
        'ubb-html-converter',
        'list-converter',
        'case-converter',
        'slugify-string',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'security-and-identity',
    title: { en: 'Security, Identity & Credentials', zh: '安全、身份与凭证' },
    pick: (tool) =>
      [
        'hash-text',
        'hmac-generator',
        'encryption',
        'bcrypt',
        'jwt-parser',
        'otp-generator',
        'password-strength-analyser',
        'rsa-key-pair-generator',
        'bip39-generator',
        'token-generator',
        'uuid-generator',
        'ulid-generator',
        'basic-auth-generator',
        'string-obfuscator',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'network-and-protocol',
    title: { en: 'Network Protocols & Diagnostics', zh: '网络协议与诊断' },
    pick: (tool) =>
      [
        'dns-lookup',
        'url-parser',
        'http-status-codes',
        'safelink-decoder',
        'user-agent-parser',
        'device-information',
        'ipv4',
        'ipv6',
        'cidr-calculator',
        'ip-representation-converter',
        'mac-address',
        'phone-parser-and-formatter',
        'iban-validator-and-parser',
        'mime-types',
        'random-port-generator',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'developer-productivity',
    title: { en: 'Developer Productivity', zh: '开发效率与工程辅助' },
    pick: (tool) =>
      [
        'code-formatter',
        'js-html-prettify',
        'css-beautify-minify',
        'javascript-compress',
        'sql-prettify',
        'curl-to-code',
        'docker-run-to-docker-compose-converter',
        'cron-parser',
        'crontab-generator',
        'mermaid-preview',
        'excalidraw-whiteboard',
        'chmod-calculator',
        'git-memo',
        'gzip-decompress',
        'keycode-info',
        'rem-px-converter',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'text-doc-and-content',
    title: { en: 'Text, Docs & Content', zh: '文本、文档与内容生产' },
    pick: (tool) =>
      [
        'lorem-ipsum-generator',
        'text-statistics',
        'text-diff',
        'text-line-processor',
        'ascii-text-drawer',
        'emoji-picker',
        'numeronym-generator',
        'html-stripper',
        'html-wysiwyg-editor',
        'og-meta-generator',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'image-watermark-removal',
    title: { en: 'Watermark Removal', zh: '图片去水印' },
    pick: (tool) => tool.slug.includes('watermark-remover'),
  },
  {
    id: 'media-and-visual-assets',
    title: { en: 'Media & Visual Assets', zh: '媒体与可视化资产' },
    pick: (tool) =>
      [
        'qrcode-generator',
        'wifi-qrcode-generator',
        'image-format-converter',
        'svg-placeholder-generator',
        'camera-recorder',
        'color-converter',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'math-time-and-units',
    title: { en: 'Math, Time & Units', zh: '数学、时间与单位计算' },
    pick: (tool) =>
      [
        'math-evaluator',
        'percentage-calculator',
        'eta-calculator',
        'date-converter',
        'base-converter',
        'roman-numeral-converter',
        'temperature-converter',
        'unit-converter',
        'chronometer',
        'benchmark-builder',
      ].some((key) => tool.slug.includes(key)),
  },
  {
    id: 'general-tools',
    title: { en: 'General Tools', zh: '图片文件通用工具' },
    pick: () => true,
  },
]

export function getFunctionalGroups(locale: Locale): FunctionalGroup[] {
  return FUNCTIONAL_GROUPS_TEMPLATE.map((group) => ({
    id: group.id,
    title: group.title[locale],
    pick: group.pick,
  }))
}
