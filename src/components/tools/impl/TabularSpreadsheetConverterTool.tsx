'use client'

import { useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function TabularSpreadsheetConverterTool() {
  const [csvPreview, setCsvPreview] = useState('')
  const [err, setErr] = useState('')
  const [hint, setHint] = useState('')

  const downloadXlsxFromCsv = async (csvText: string) => {
    setErr('')
    try {
      const [XLSX, { default: Papa }] = await Promise.all([import('xlsx'), import('papaparse')])
      const parsed = Papa.parse<string[]>(csvText, { header: false })
      const rows = parsed.data.filter((r) => r.some((c) => String(c).trim() !== ''))
      if (rows.length === 0) throw new Error('无有效行')
      const ws = XLSX.utils.aoa_to_sheet(rows as string[][])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'export.xlsx')
      setHint('已下载 export.xlsx')
      window.setTimeout(() => setHint(''), 3000)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setErr('')
    setHint('')
    try {
      const buf = await f.arrayBuffer()
      const XLSX = await import('xlsx')
      if (f.name.toLowerCase().endsWith('.csv')) {
        const text = new TextDecoder('utf-8').decode(buf)
        setCsvPreview(text)
        return
      }
      const wb = XLSX.read(buf, { type: 'array' })
      const name = wb.SheetNames[0]
      if (!name) throw new Error('工作簿无工作表')
      const sheet = wb.Sheets[name]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      setCsvPreview(csv)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
      setCsvPreview('')
    }
  }

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">上传 CSV 或 XLSX，预览为 CSV 文本；可将当前 CSV 导出为 XLSX（SheetJS，浏览器内生成）。</p>
      <label className={toolLabelClass}>
        文件
        <input type="file" accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" className="mt-1 block text-sm" onChange={(e) => void onFile(e.target.files?.[0])} />
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {hint && <p className="text-sm text-green-700">{hint}</p>}
      <label className={toolLabelClass}>
        CSV 预览（可手工编辑后再导出）
        <ToolCodeMirror value={csvPreview} onChange={setCsvPreview} rows={14} language="plaintext" variant="in" />
      </label>
      <button
        type="button"
        disabled={!csvPreview.trim()}
        onClick={() => void downloadXlsxFromCsv(csvPreview)}
        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        下载为 XLSX
      </button>
    </div>
  )
}
