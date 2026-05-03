'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'
import { generateLoremIpsum } from '@/lib/tools/logic/lorem-ipsum'
import { randIntFromInterval } from '@/lib/tools/logic/random'

export function LoremIpsumGeneratorTool() {
  const [paragraphs, setParagraphs] = useState(1)
  const [sentMin, setSentMin] = useState(3)
  const [sentMax, setSentMax] = useState(8)
  const [wordMin, setWordMin] = useState(8)
  const [wordMax, setWordMax] = useState(15)
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true)
  const [asHTML, setAsHTML] = useState(false)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const text = useMemo(() => {
    const sLo = Math.min(sentMin, sentMax)
    const sHi = Math.max(sentMin, sentMax)
    const wLo = Math.min(wordMin, wordMax)
    const wHi = Math.max(wordMin, wordMax)
    const sentencePerParagraph = randIntFromInterval(sLo, sHi)
    const wordCount = randIntFromInterval(wLo, wHi)
    return generateLoremIpsum({
      paragraphCount: paragraphs,
      sentencePerParagraph,
      wordCount,
      startWithLoremIpsum,
      asHTML,
    })
  }, [paragraphs, sentMin, sentMax, wordMin, wordMax, startWithLoremIpsum, asHTML])

  const [hint, setHint] = useState('')

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div>
        <div className="mb-1 flex justify-between text-sm text-gray-700">
          <span>段落数</span>
          <span className="font-mono text-orange-700">{paragraphs}</span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={paragraphs}
          onChange={(e) => setParagraphs(Number(e.target.value))}
          className="w-full accent-orange-600"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">每段句数（最小）</span>
          <input
            type="number"
            min={1}
            max={50}
            value={sentMin}
            onChange={(e) => setSentMin(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full rounded-md border border-gray-200 px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">每段句数（最大）</span>
          <input
            type="number"
            min={1}
            max={50}
            value={sentMax}
            onChange={(e) => setSentMax(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full rounded-md border border-gray-200 px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">每句词数（最小）</span>
          <input
            type="number"
            min={1}
            max={50}
            value={wordMin}
            onChange={(e) => setWordMin(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full rounded-md border border-gray-200 px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">每句词数（最大）</span>
          <input
            type="number"
            min={1}
            max={50}
            value={wordMax}
            onChange={(e) => setWordMax(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full rounded-md border border-gray-200 px-2 py-1 font-mono text-sm"
          />
        </label>
      </div>

      <label className="flex items-center justify-between gap-3 text-sm text-gray-700">
        <span>首段以「Lorem ipsum…」开头</span>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-orange-300 text-orange-600"
          checked={startWithLoremIpsum}
          onChange={(e) => setStartWithLoremIpsum(e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-sm text-gray-700">
        <span>输出为 HTML（&lt;p&gt; 包裹）</span>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-orange-300 text-orange-600"
          checked={asHTML}
          onChange={(e) => setAsHTML(e.target.checked)}
        />
      </label>

      <ToolCodeMirror
        ref={outRef}
        readOnly
        value={text}
        rows={8}
        language={asHTML ? 'html' : 'plaintext'}
        variant="out"
        placeholder="Lorem ipsum…"
        className="[&_.cm-content]:font-sans"
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(text)
            setHint('已复制')
            window.setTimeout(() => setHint(''), 2000)
          }}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          复制
        </button>
      </div>
      {hint ? <p className="text-center text-sm text-green-700">{hint}</p> : null}
    </ToolShortcutArea>
  )
}
