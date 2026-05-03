'use client'

import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { codesByCategories } from '@/lib/tools/data/http-status-codes'

type FlatCode = (typeof codesByCategories)[number]['codes'][number] & { category: string }

const flatAll: FlatCode[] = codesByCategories.flatMap(({ codes, category }) =>
  codes.map((code) => ({ ...code, category })),
)

const fuse = new Fuse(flatAll, {
  keys: [
    { name: 'code', weight: 3 },
    { name: 'name', weight: 2 },
    'description',
    'category',
  ],
  threshold: 0.35,
})

export function HttpStatusCodesTool() {
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    if (!search.trim()) {
      return codesByCategories.map((c) => ({ category: c.category, codes: c.codes }))
    }
    const hits = fuse.search(search.trim()).map((r) => r.item)
    return [{ category: '搜索结果', codes: hits }]
  }, [search])

  return (
    <div className="space-y-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索 HTTP 状态码、名称或说明…"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />

      {grouped.map(({ category, codes }) => (
        <section key={category}>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{category}</h2>
          <ul className="space-y-2">
            {codes.map((c) => (
              <li key={`${category}-${c.code}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="text-base font-bold text-gray-900">
                  {c.code} {c.name}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {c.description}
                  {c.type !== 'HTTP' ? `（${c.type}）` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
