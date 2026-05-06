import Link from 'next/link'
import { t } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'

export default async function NotFound() {
  const locale = await getRequestLocale()
  const i18n = t(locale)
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">{i18n.notFoundTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {i18n.notFoundBody}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {i18n.goHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
