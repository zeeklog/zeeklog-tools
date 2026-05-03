'use client'

import { useMemo, useState } from 'react'
import { textToBase64 } from '@/lib/tools/logic/base64-convert'

export function BasicAuthGeneratorTool() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [hint, setHint] = useState('')

  const header = useMemo(
    () => `Authorization: Basic ${textToBase64(`${username}:${password}`)}`,
    [username, password],
  )

  const copy = async () => {
    await navigator.clipboard.writeText(header)
    setHint('已复制')
    window.setTimeout(() => setHint(''), 2000)
  }

  return (
    <div className="space-y-6">
      <label className="block text-sm text-gray-700">
        用户名
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          autoComplete="username"
        />
      </label>
      <label className="block text-sm text-gray-700">
        密码
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          autoComplete="current-password"
        />
      </label>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="mb-2 text-xs text-gray-500">Authorization 头</p>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-gray-900">{header}</pre>
      </div>
      <div className="flex justify-center">
        <button type="button" onClick={copy} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white">
          复制请求头
        </button>
      </div>
      {hint ? <p className="text-center text-sm text-gray-600">{hint}</p> : null}
    </div>
  )
}
