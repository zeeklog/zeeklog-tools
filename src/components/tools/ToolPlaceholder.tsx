import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export function ToolPlaceholder({ locale = 'en' }: { locale?: Locale }) {
  const i18n = t(locale)
  return (
    <div className="rounded-lg border border-dashed border-orange-200 bg-orange-50/50 px-4 py-8 text-center">
      <p className="text-sm font-medium text-orange-800">{i18n.toolUpdating}</p>
    </div>
  )
}
