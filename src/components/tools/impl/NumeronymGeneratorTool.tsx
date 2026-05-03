'use client'

import { useMemo, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { generateNumeronym } from '@/lib/tools/logic/numeronym'

export function NumeronymGeneratorTool() {
  const [word, setWord] = useState('')
  const numeronym = useMemo(() => generateNumeronym(word), [word])

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="输入单词，例如 internationalization"
        className="w-full max-w-xl rounded-lg border border-gray-200 px-4 py-3 text-lg text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
      <ArrowDown className="h-8 w-8 text-orange-400" aria-hidden />
      <input
        type="text"
        readOnly
        value={numeronym}
        placeholder="数字名结果，例如 i18n"
        className="w-full max-w-xl rounded-lg border border-orange-100 bg-orange-50/50 px-4 py-3 text-lg font-mono text-gray-900"
      />
    </div>
  )
}
