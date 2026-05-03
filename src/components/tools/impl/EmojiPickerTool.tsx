'use client'

import { useEffect, useMemo, useState } from 'react'

export function EmojiPickerTool() {
  const [list, setList] = useState<string[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    void import('unicode-emoji-json/data-ordered-emoji.json').then((m) =>
      setList((m as { default: string[] }).default),
    )
  }, [])

  const filtered = useMemo(() => {
    if (!q.trim()) return list
    return list.filter((e) => e.includes(q.trim()))
  }, [list, q])

  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="过滤（部分 emoji 可搜）" className="w-full rounded border px-3 py-2 text-sm" />
      <div className="max-h-[480px] overflow-auto rounded-lg border bg-white p-2 text-2xl leading-relaxed">
        {filtered.slice(0, 800).map((e) => (
          <button
            key={e}
            type="button"
            title={e}
            className="inline-block p-1 hover:bg-orange-50"
            onClick={() => void navigator.clipboard.writeText(e)}
          >
            {e}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">点击复制到剪贴板。共 {list.length} 个，当前显示 {Math.min(800, filtered.length)} 个。</p>
    </div>
  )
}
