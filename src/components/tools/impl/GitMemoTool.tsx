'use client'

import ReactMarkdown from 'react-markdown'
import { GIT_MEMO_MARKDOWN } from '@/lib/tools/data/git-memo-content'

export function GitMemoTool() {
  return (
    <article className="prose prose-sm max-w-none text-gray-800 prose-pre:bg-gray-900 prose-pre:text-gray-100">
      <ReactMarkdown>{GIT_MEMO_MARKDOWN}</ReactMarkdown>
    </article>
  )
}
