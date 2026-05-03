'use client'

import type { Chart } from 'chart.js'
import { useEffect, useRef, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

const SAMPLE = `label,value\nJan,12\nFeb,19\nMar,7`

/** Chart.js + Papa 运行时加载，避免进入工具页即拉取完整图表依赖 */
export function ChartFromCsvTool() {
  const [csv, setCsv] = useState(SAMPLE)
  const [loadError, setLoadError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const chartJsRef = useRef<typeof import('chart.js') | null>(null)
  const papaRef = useRef<typeof import('papaparse')['default'] | null>(null)

  useEffect(() => {
    let cancelled = false
    chartRef.current?.destroy()
    chartRef.current = null

    ;(async () => {
      setLoadError('')
      try {
        if (!chartJsRef.current) {
          const mod = await import('chart.js')
          const { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } = mod
          Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend)
          chartJsRef.current = mod
        }
        if (!papaRef.current) {
          papaRef.current = (await import('papaparse')).default
        }
        const { Chart } = chartJsRef.current
        const Papa = papaRef.current

        if (cancelled) return
        const canvas = canvasRef.current
        if (!canvas) return

        const parsed = Papa.parse<string[]>(csv, { header: false, skipEmptyLines: 'greedy' })
        const rows = parsed.data.filter((r) => r.length >= 2 && r.some((c) => String(c).trim() !== ''))
        if (rows.length < 2) {
          return
        }
        const header = rows[0]!.map((c) => String(c).trim())
        const dataRows = rows.slice(1)
        const labels = dataRows.map((r) => String(r[0]))
        const values = dataRows.map((r) => {
          const n = Number(String(r[1]).replace(/,/g, ''))
          return Number.isFinite(n) ? n : NaN
        })
        if (values.some((n) => Number.isNaN(n))) {
          return
        }

        chartRef.current = new Chart(canvas, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: header[1] || 'series',
                data: values,
                borderColor: 'rgb(234 88 12)',
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                tension: 0.2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: `${header[0] ?? 'x'} / ${header[1] ?? 'y'}` },
            },
          },
        })
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : '图表依赖加载失败')
        }
      }
    })()

    return () => {
      cancelled = true
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [csv])

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">首行为表头：第一列分类、第二列数值。仅支持简单折线图。</p>
      {loadError ? <p className="text-sm text-red-600">{loadError}</p> : null}
      <label className={toolLabelClass}>
        CSV
        <ToolCodeMirror value={csv} onChange={setCsv} rows={8} language="plaintext" variant="in" />
      </label>
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <canvas ref={canvasRef} className="max-h-80 w-full" />
      </div>
    </div>
  )
}
