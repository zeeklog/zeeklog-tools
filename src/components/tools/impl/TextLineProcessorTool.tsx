'use client'

import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { applyLinePreset, type LinePreset, wordFrequency } from '@/lib/tools/logic/text-line-ops'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

const PRESETS: { id: LinePreset; label: string }[] = [
  { id: 'dedupe', label: '去重行' },
  { id: 'sort', label: '排序（升序）' },
  { id: 'sort-desc', label: '排序（降序）' },
  { id: 'trim-lines', label: '每行 trim' },
  { id: 'remove-empty', label: '删空行' },
  { id: 'remove-punctuation', label: '删标点（Unicode）' },
  { id: 'reverse-lines', label: '行序反转' },
]

export function TextLineProcessorTool() {
  const [text, setText] = useState('b\na\nb\n')
  const [preset, setPreset] = useState<LinePreset>('dedupe')
  const [showFreq, setShowFreq] = useState(false)
  const limitMsg = assertInputWithinLimit(text)

  const mainOut = useMemo(() => {
    if (limitMsg) return ''
    return applyLinePreset(text, preset)
  }, [text, preset, limitMsg])

  const freqText = useMemo(() => {
    if (!showFreq || limitMsg) return ''
    const rows = wordFrequency(text)
    return rows.map((r) => `${r.word}\t${r.count}`).join('\n')
  }, [text, showFreq, limitMsg])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 text-sm">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={`rounded-lg border px-3 py-1.5 ${preset === p.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={showFreq} onChange={(e) => setShowFreq(e.target.checked)} />
        显示词频（Tab 分隔，基于整段文本）
      </label>
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      <div className={toolSectionClass}>
        <div className={toolConverterEditorGridClass}>
          <label className={toolLabelClass}>
            输入
            <ToolCodeMirror value={text} onChange={setText} rows={10} language="plaintext" variant="in" />
          </label>
          <label className={toolLabelClass}>
            结果
            <ToolCodeMirror readOnly value={mainOut} rows={10} language="plaintext" variant="out" />
          </label>
        </div>
        {showFreq && (
          <label className={toolLabelClass}>
            词频
            <ToolCodeMirror readOnly value={freqText} rows={8} language="plaintext" variant="out" />
          </label>
        )}
      </div>
    </div>
  )
}
