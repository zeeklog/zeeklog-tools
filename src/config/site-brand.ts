import type { Locale } from '@/lib/i18n'

export const SITE_NAME: Record<Locale, string> = {
  en: 'Zeeklog Online Toolkit',
  zh: '极客日志 · 在线工具箱',
}

/** 对外主域名（纯域名，不含协议） */
export const SITE_DOMAIN = 'zeeklog.com'

export function getSiteName(locale: Locale): string {
  return SITE_NAME[locale]
}
