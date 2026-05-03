'use client'

import zxcvbn from 'zxcvbn'
import { useMemo, useState } from 'react'

const labels = ['极弱', '弱', '一般', '强', '很强'] as const

export function PasswordStrengthAnalyserTool() {
  const [pwd, setPwd] = useState('')

  const r = useMemo(() => (pwd ? zxcvbn(pwd) : null), [pwd])

  return (
    <div className="space-y-4">
      <label className="block text-sm text-gray-700">
        密码
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </label>
      {r && (
        <div className="space-y-2 rounded-xl border border-gray-100 p-4">
          <p className="text-lg font-semibold text-gray-900">
            得分 {r.score} / 4 — {labels[r.score]}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${((r.score + 1) / 5) * 100}%` }}
            />
          </div>
          {r.feedback.warning ? <p className="text-sm text-amber-700">{r.feedback.warning}</p> : null}
          {r.feedback.suggestions.length > 0 && (
            <ul className="list-inside list-disc text-sm text-gray-600">
              {r.feedback.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500">暴力破解估算：约 {r.crack_times_display.offline_slow_hashing_1e4_per_second}</p>
        </div>
      )}
    </div>
  )
}
