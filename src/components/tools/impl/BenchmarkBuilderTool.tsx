'use client'

import { useMemo, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { arrayToMarkdownTable, computeAverage, computeVariance } from '@/lib/tools/logic/benchmark-stats'

type Suite = { title: string; data: string }

function parseNums(s: string): number[] {
  return s
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
}

export function BenchmarkBuilderTool() {
  const [suites, setSuites] = useState<Suite[]>([
    { title: 'Suite 1', data: '5 10' },
    { title: 'Suite 2', data: '8 12' },
  ])
  const [unit, setUnit] = useState('')

  const results = useMemo(() => {
    const round = (v: number) => Math.round(v * 1000) / 1000
    const rows = suites.map(({ title, data }) => {
      const nums = parseNums(data)
      return {
        title,
        size: nums.length,
        mean: computeAverage(nums),
        variance: computeVariance(nums),
      }
    })
    const sorted = [...rows].sort((a, b) => a.mean - b.mean)
    const best = sorted[0]?.mean ?? 0
    return sorted.map((r, index) => {
      const delta = r.mean - best
      const ratio = best === 0 ? '∞' : round(r.mean / best)
      const extra =
        index !== 0 && r.mean !== best ? ` (+${round(delta)}${unit}; x${ratio})` : ''
      return {
        position: index + 1,
        title: r.title,
        size: r.size,
        mean: `${round(r.mean)}${unit}${extra}`,
        variance: `${round(r.variance)}${unit}${unit ? '²' : ''}`,
      }
    })
  }, [suites, unit])

  const headerMap = {
    position: '排名',
    title: '套件',
    size: '样本数',
    mean: '均值',
    variance: '方差',
  }

  return (
    <ToolShortcutArea className={toolSectionClass}>
      <label className={toolLabelClass}>
        单位后缀（可选）
        <input value={unit} onChange={(e) => setUnit(e.target.value)} className={`${toolInputClass} max-w-xs`} />
      </label>
      {suites.map((s, i) => (
        <div key={i} className="rounded-lg border p-3">
          <input
            value={s.title}
            onChange={(e) => {
              const n = [...suites]
              n[i] = { ...n[i]!, title: e.target.value }
              setSuites(n)
            }}
            className="mb-2 w-full font-medium"
          />
          <ToolCodeMirror
            value={s.data}
            onChange={(v) => {
              const n = [...suites]
              n[i] = { ...n[i]!, data: v }
              setSuites(n)
            }}
            rows={2}
            language="plaintext"
            variant="in"
            placeholder="空格或逗号分隔数字"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setSuites([...suites, { title: `Suite ${suites.length + 1}`, data: '' }])}
        className="rounded border px-3 py-1 text-sm"
      >
        添加套件
      </button>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">#</th>
            <th>套件</th>
            <th>n</th>
            <th>均值</th>
            <th>方差</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.title} className="border-t">
              <td className="py-2">{r.position}</td>
              <td>{r.title}</td>
              <td>{r.size}</td>
              <td className="font-mono text-xs">{r.mean}</td>
              <td className="font-mono text-xs">{r.variance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => void navigator.clipboard.writeText(arrayToMarkdownTable(results, headerMap))}
        className="rounded bg-orange-500 px-3 py-1.5 text-sm text-white"
      >
        复制为 Markdown 表格
      </button>
    </ToolShortcutArea>
  )
}
