'use client'

import { Globe } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

type LanguageSwitcherProps = {
  locale: Locale
}

function buildRedirectPath(pathname: string, query: string): string {
  if (!query) return pathname
  return `${pathname}?${query}`
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const i18n = t(locale)

  const redirect = buildRedirectPath(pathname, searchParams.toString())

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1">
      <Globe className="h-4 w-4 text-slate-500" aria-hidden />
      <span className="text-xs text-slate-500">{i18n.languageLabel}</span>
      <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs">
        <a
          href={`/api/locale?locale=en&redirect=${encodeURIComponent(redirect)}`}
          className={`rounded px-2 py-1 ${locale === 'en' ? 'bg-white font-medium text-slate-900 shadow-sm' : 'text-slate-600'}`}
          aria-current={locale === 'en' ? 'page' : undefined}
        >
          EN
        </a>
        <a
          href={`/api/locale?locale=zh&redirect=${encodeURIComponent(redirect)}`}
          className={`rounded px-2 py-1 ${locale === 'zh' ? 'bg-white font-medium text-slate-900 shadow-sm' : 'text-slate-600'}`}
          aria-current={locale === 'zh' ? 'page' : undefined}
        >
          中文
        </a>
      </div>
    </div>
  )
}
