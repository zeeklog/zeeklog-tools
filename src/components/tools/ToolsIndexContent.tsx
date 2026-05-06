import Link from 'next/link'
import { Search } from 'lucide-react'
import { isToolImplemented } from '@/lib/tools/implemented'
import { interpolate, type Locale, t } from '@/lib/i18n'
import type { ToolDefinition } from '@/lib/tools/types'
import { TOOL_CATEGORIES_ORDER, toolsInCategory } from '@/lib/tools/registry'
import { getFunctionalGroups } from '@/lib/tools/functional-tool-groups'
import { toolMatchesSearchQuery } from '@/lib/tools/tool-search-match'
import { ToolsGroupNav } from '@/components/tools/ToolsGroupNav'

function buildPageData(query: string, locale: Locale) {
  const groups = getFunctionalGroups(locale)
  const toolsByCategory = new Map(TOOL_CATEGORIES_ORDER.map((cat) => [cat, toolsInCategory(cat, locale)] as const))
  const q = query.trim()
  const byCategory = new Map<string, ToolDefinition[]>()
  for (const cat of TOOL_CATEGORIES_ORDER) {
    const list = (toolsByCategory.get(cat) ?? []).filter((tool) => toolMatchesSearchQuery(tool, q))
    if (list.length) byCategory.set(cat, list)
  }

  const allVisible = TOOL_CATEGORIES_ORDER.flatMap((cat) => byCategory.get(cat) ?? [])
  const taken = new Set<string>()
  const groupedTools = groups.map((group) => {
    const list = allVisible.filter((tool) => {
      if (taken.has(tool.slug)) return false
      if (!group.pick(tool)) return false
      taken.add(tool.slug)
      return true
    })
    return { ...group, tools: list }
  }).filter((group) => group.tools.length > 0)

  return { groupedTools, totalVisible: allVisible.length, query: q }
}

type ToolsIndexContentProps = { query?: string; locale: Locale }

export function ToolsIndexContent({ query = '', locale }: ToolsIndexContentProps) {
  const i18n = t(locale)
  const q = query.trim()
  const defaultPageData = buildPageData('', locale)
  const { groupedTools, totalVisible } = q ? buildPageData(q, locale) : defaultPageData
  const navGroups = groupedTools.map((group) => ({ id: group.id, title: group.title, count: group.tools.length }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-4xl">
        <h1 className="text-pretty text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{i18n.toolsHeading}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {i18n.toolsDescription}
        </p>
      </header>

      <div className="mb-10 rounded-2xl border border-orange-100/80 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 p-5 shadow-sm sm:p-6">
        <form action="/search" method="get" className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-700">
            <Search className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <input
              id="tools-filter"
              name="q"
              type="search"
              defaultValue={query}
              placeholder={i18n.searchPlaceholder}
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 sm:text-sm"
            />
          </span>
          <button
            type="submit"
            className="inline-flex shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            {i18n.searchButton}
          </button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="sticky top-24 rounded-2xl border border-orange-100 bg-white/90 p-3 shadow-sm">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{i18n.toolCategories}</p>
            <ToolsGroupNav groups={navGroups} locale={locale} />
          </div>
        </aside>

        <div className="space-y-12">
          {groupedTools.map((group) => (
            <section
              key={group.id}
              id={`group-${group.id}`}
              aria-labelledby={`group-title-${group.id}`}
            >
              <h2 id={`group-title-${group.id}`} className="mb-4 text-lg font-semibold text-orange-900">
                {group.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.tools.map((tool) => {
                  const done = isToolImplemented(tool.slug)
                  return (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        prefetch={false}
                        className={`flex h-full flex-col rounded-2xl border p-4 transition ${
                          done
                            ? 'border-orange-200/90 bg-white shadow-sm hover:border-orange-400 hover:shadow-md'
                            : 'border-dashed border-orange-200/80 bg-orange-50/40 hover:border-orange-300'
                        }`}
                      >
                        <span className="font-medium text-slate-900">{tool.title}</span>
                        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{tool.description}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {totalVisible === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-600">
          {interpolate(i18n.noSearchResult, { query })}
        </p>
      ) : null}
    </div>
  )
}
