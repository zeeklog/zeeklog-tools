export const SUPPORTED_LOCALES = ['en', 'zh'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE_NAME = 'locale'

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'zh'
}

export function resolveLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

type I18nStrings = {
  languageName: string
  siteName: string
  siteTagline: string
  skipToContent: string
  home: string
  githubOpenSourceBadge: string
  authorHomepageBadge: string
  githubOpenSourceAria: string
  authorHomepageAria: string
  mainNavLabel: string
  footerSummary: string
  languageLabel: string
  toolsHeading: string
  toolsDescription: string
  searchPlaceholder: string
  searchButton: string
  toolCategories: string
  noSearchResult: string
  notFoundTitle: string
  notFoundBody: string
  goHome: string
  pageErrorTitle: string
  pageErrorBody: string
  retry: string
  routeLoading: string
  toolUpdating: string
  groupNavAriaLabel: string
  toolPageNavLabel: string
  backHome: string
  toolFeatures: string
  toolHowTo: string
  toolFaq: string
  toolRelated: string
  toolRelatedHint: string
  toolAbout: string
  toolUseStep1: string
  toolUseStep2: string
  toolUseStep3: string
  toolUseNote: string
  homeMetaTitle: string
  homeMetaDescription: string
  homeOgTitle: string
  searchMetaTitle: string
  searchMetaDescription: string
  layoutMetaDescription: string
  layoutOgDescription: string
  notFoundMetaTitle: string
}

const STRINGS: Record<Locale, I18nStrings> = {
  en: {
    languageName: 'English',
    siteName: 'Zeeklog Online Toolkit',
    siteTagline: 'Format conversion, encoding, text processing, and developer utilities.',
    skipToContent: 'Skip to main content',
    home: 'Home',
    githubOpenSourceBadge: 'GitHub OpenSource',
    authorHomepageBadge: 'Author Homepage',
    githubOpenSourceAria: 'Open GitHub OpenSource repository in a new tab',
    authorHomepageAria: 'Open author homepage in a new tab',
    mainNavLabel: 'Main navigation',
    footerSummary: 'A collection of practical tools for development and content workflows.',
    languageLabel: 'Language',
    toolsHeading: 'Online Toolkit',
    toolsDescription:
      'Common tools for format conversion, encoding/decoding, text processing, network diagnostics, and media helpers. Browse by group or search directly.',
    searchPlaceholder: 'Search by name, description, or slug…',
    searchButton: 'Search',
    toolCategories: 'Categories',
    noSearchResult: 'No tools matched "{query}". Try another keyword.',
    notFoundTitle: 'This page is not available',
    notFoundBody: 'The address does not exist. Go back to the homepage and continue browsing the tools.',
    goHome: 'Back to Home',
    pageErrorTitle: 'This page is temporarily unavailable',
    pageErrorBody: 'Something went wrong. Please try again in a moment.',
    retry: 'Retry',
    routeLoading: 'Loading tool…',
    toolUpdating: 'This tool is being updated',
    groupNavAriaLabel: 'Tool groups',
    toolPageNavLabel: 'Tool page navigation',
    backHome: 'Back to Home',
    toolFeatures: 'Features',
    toolHowTo: 'How to Use',
    toolFaq: 'FAQ',
    toolRelated: 'Related Tools',
    toolRelatedHint: 'Browse more tools by category.',
    toolAbout: 'About This Tool',
    toolUseStep1: 'Enter or paste your input in the tool area above, or upload a file when supported.',
    toolUseStep2: 'Adjust options as needed, then run the conversion, calculation, formatting, or generation.',
    toolUseStep3: 'Review the output directly on the page, then copy or download if available.',
    toolUseNote:
      'Most tools run in your browser. For sensitive data, please evaluate usage against your security requirements.',
    homeMetaTitle: 'Online Toolkit',
    homeMetaDescription:
      'Browse practical online developer tools for conversion, encoding, text processing, network diagnostics, and media workflows.',
    homeOgTitle: 'Online Toolkit Home',
    searchMetaTitle: 'Tool Search',
    searchMetaDescription: 'Search tools by name, description, or slug.',
    layoutMetaDescription:
      'A practical online toolkit for conversion, encoding, text processing, network diagnostics, and media helpers.',
    layoutOgDescription:
      'Discover practical developer tools for conversion, encoding, text processing, network diagnostics, and media helpers.',
    notFoundMetaTitle: 'Tool Not Found',
  },
  zh: {
    languageName: '中文',
    siteName: '极客日志 · 在线工具箱',
    siteTagline: '格式转换、编码解码、文本处理与开发辅助工具。',
    skipToContent: '跳到主要内容',
    home: '首页',
    githubOpenSourceBadge: 'GitHub 开源仓库',
    authorHomepageBadge: '开源作者主页',
    githubOpenSourceAria: '在新标签页打开 GitHub 开源仓库',
    authorHomepageAria: '在新标签页打开开源作者主页',
    mainNavLabel: '主导航',
    footerSummary: '常用开发与内容处理工具集合。',
    languageLabel: '语言',
    toolsHeading: '在线工具箱',
    toolsDescription:
      '收录常用格式转换、编码解码、文本处理、网络诊断与图片辅助工具。可按分类浏览，也可直接搜索工具名称或关键词。',
    searchPlaceholder: '按名称、简介或 slug 搜索…',
    searchButton: '搜索',
    toolCategories: '工具分类',
    noSearchResult: '没有匹配「{query}」的工具，请换个关键词试试。',
    notFoundTitle: '这个页面不在工具站里',
    notFoundBody: '这个地址不存在。返回首页后，可以继续浏览当前站点保留的工具页。',
    goHome: '返回首页',
    pageErrorTitle: '页面暂时无法打开',
    pageErrorBody: '工具站遇到了一点异常，请稍后再试。',
    retry: '重试',
    routeLoading: '正在载入工具…',
    toolUpdating: '该工具正在升级',
    groupNavAriaLabel: '工具功能分组',
    toolPageNavLabel: '工具页导航',
    backHome: '返回首页',
    toolFeatures: '功能与特点',
    toolHowTo: '如何使用',
    toolFaq: '常见问题',
    toolRelated: '推荐与相关工具',
    toolRelatedHint: '按分类继续浏览站内其他工具。',
    toolAbout: '关于本工具',
    toolUseStep1: '在上方「在线使用」区域输入或粘贴待处理内容，或按界面提示上传文件。',
    toolUseStep2: '根据需要调整选项，点击对应按钮完成格式化、转换、计算或生成。',
    toolUseStep3: '在页面中直接查看结果；若工具提供，可复制或下载输出内容。',
    toolUseNote: '本工具在浏览器中运行，处理逻辑尽量在本地完成；涉及敏感数据时，请结合业务安全要求评估后使用。',
    homeMetaTitle: '在线工具箱',
    homeMetaDescription: '收录常用格式转换、编码解码、文本处理、网络诊断与图片辅助工具。',
    homeOgTitle: '常用工具首页',
    searchMetaTitle: '工具搜索',
    searchMetaDescription: '按名称、简介或 slug 搜索站内工具。',
    layoutMetaDescription: '收录常用格式转换、编码解码、文本处理、网络排障与图片辅助工具。',
    layoutOgDescription: '汇总常用格式转换、编码解码、文本处理、网络排障与图片辅助工具。',
    notFoundMetaTitle: '未找到工具',
  },
}

export function t(locale: Locale): I18nStrings {
  return STRINGS[locale]
}

export function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}
