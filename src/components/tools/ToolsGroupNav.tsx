import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

type GroupNavItem = {
  id: string
  title: string
  count: number
}

type ToolsGroupNavProps = {
  groups: GroupNavItem[]
  locale: Locale
}

export function ToolsGroupNav({ groups, locale }: ToolsGroupNavProps) {
  const i18n = t(locale)
  return (
    <nav className="space-y-1.5" aria-label={i18n.groupNavAriaLabel}>
      {groups.map((group) => (
        <a
          key={group.id}
          href={`#group-${group.id}`}
          className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <span className="pl-2">
            {group.title}
            <span className="ml-1 text-xs text-slate-400">({group.count})</span>
          </span>
        </a>
      ))}
    </nav>
  )
}
