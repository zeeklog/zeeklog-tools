'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  generateAddresses,
  getAddressRegionOptions,
  getQuickAddressCounts,
  listAllAddresses,
  normalizeAddressCount,
} from '@/lib/tools/logic/address-generator'

type AddressGeneratorKind =
  | 'us'
  | 'uk'
  | 'hk'
  | 'sg'
  | 'california'
  | 'newzealand'
  | 'spain'

type AddressGeneratorToolBaseProps = {
  kind: AddressGeneratorKind
  downloadName: string
}

export function AddressGeneratorToolBase({ kind, downloadName }: AddressGeneratorToolBaseProps) {
  const quickCounts = getQuickAddressCounts()
  const regionOptions = useMemo(() => getAddressRegionOptions(kind), [kind])
  const [count, setCount] = useState(quickCounts[0] ?? 5)
  const [region, setRegion] = useState(regionOptions[0]?.value ?? 'all')
  const [lines, setLines] = useState<string[]>(() => generateAddresses(kind, count, region))
  const [hint, setHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const output = lines.join('\n')

  const generate = () => {
    const normalized = normalizeAddressCount(count)
    setCount(normalized)
    setLines(generateAddresses(kind, normalized, region))
  }

  const showAll = () => {
    setLines(listAllAddresses(kind, region))
  }

  const copyAll = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setHint('已复制全部地址')
    window.setTimeout(() => setHint(''), 1800)
  }

  const downloadAll = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${downloadName}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={toolLabelClass}>
          生成数量
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className={toolInputClass}
          />
        </label>
        {regionOptions.length > 0 ? (
          <label className={toolLabelClass}>
            地区
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={toolInputClass}>
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickCounts.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setCount(num)}
            className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm text-orange-700 hover:bg-orange-100"
          >
            {num} Address
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          生成 Generate
        </button>
        <button
          type="button"
          onClick={showAll}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          显示全部 Show All
        </button>
        <button
          type="button"
          onClick={downloadAll}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          下载 Download
        </button>
        <button
          type="button"
          onClick={() => void copyAll()}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          复制 Copy
        </button>
        {hint ? <span className="self-center text-sm text-green-700">{hint}</span> : null}
      </div>

      <ToolCodeMirror
        ref={outRef}
        readOnly
        value={output}
        rows={Math.min(18, Math.max(6, lines.length + 1))}
        language="plaintext"
        variant="out"
      />
    </ToolShortcutArea>
  )
}
