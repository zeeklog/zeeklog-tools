'use client'

import { useMemo, useState } from 'react'
import {
  type ChmodGroup,
  type ChmodScope,
  computeChmodOctalRepresentation,
  computeChmodSymbolicRepresentation,
  defaultChmodPermissions,
} from '@/lib/tools/logic/chmod-calculator'
import { useToolLocale } from '@/components/tools/tool-locale'

const SCOPES: { scope: ChmodScope; title: string }[] = [
  { scope: 'read', title: 'Read (4)' },
  { scope: 'write', title: 'Write (2)' },
  { scope: 'execute', title: 'Execute (1)' },
]

const GROUPS: ChmodGroup[] = ['owner', 'group', 'public']

const GROUP_LABEL: Record<ChmodGroup, string> = {
  owner: 'Owner (u)',
  group: 'Group (g)',
  public: 'Public (o)',
}

export function ChmodCalculatorTool() {
  const locale = useToolLocale()
  const [permissions, setPermissions] = useState(defaultChmodPermissions)

  const octal = useMemo(() => computeChmodOctalRepresentation({ permissions }), [permissions])
  const symbolic = useMemo(() => computeChmodSymbolicRepresentation({ permissions }), [permissions])

  const toggle = (group: ChmodGroup, scope: ChmodScope) => {
    setPermissions((p) => ({
      ...p,
      [group]: { ...p[group], [scope]: !p[group][scope] },
    }))
  }

  const chmodCmd = `chmod ${octal} path`

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-right" />
              {GROUPS.map((g) => (
                <th key={g} className="p-3 text-center font-medium text-gray-800">
                  {GROUP_LABEL[g]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCOPES.map(({ scope, title }) => (
              <tr key={scope}>
                <td className="p-3 text-right font-medium text-gray-700">{title}</td>
                {GROUPS.map((g) => (
                  <td key={g} className="p-3 text-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-orange-600"
                      checked={permissions[g][scope]}
                      onChange={() => toggle(g, scope)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center font-mono text-4xl text-orange-600">{octal}</div>
      <div className="text-center font-mono text-4xl text-orange-600">{symbolic}</div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">
        <span>{chmodCmd}</span>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(chmodCmd)}
          className="rounded border border-gray-200 px-2 py-0.5 text-xs"
        >
          {locale === 'zh' ? '复制' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
