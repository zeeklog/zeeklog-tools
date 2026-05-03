'use client'

import cronstrue from 'cronstrue'
import { isValidCron } from 'cron-validator'
import { useMemo, useState } from 'react'

export function CrontabGeneratorTool() {
  const [expr, setExpr] = useState('0 0 * * *')

  const { human, valid } = useMemo(() => {
    const v = isValidCron(expr, { seconds: false, allowBlankDay: true })
    if (!v) return { human: '', valid: false }
    try {
      return { human: cronstrue.toString(expr), valid: true }
    } catch {
      return { human: '', valid: false }
    }
  }, [expr])

  return (
    <div className="space-y-4">
      <label className="block text-sm text-gray-700">
        Cron 表达式（五段：分 时 日 月 周）
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
        />
      </label>
      {!valid && expr.trim() !== '' && <p className="text-sm text-red-600">表达式无效</p>}
      {valid && <p className="rounded-lg bg-gray-50 p-4 text-gray-800">{human}</p>}
    </div>
  )
}
