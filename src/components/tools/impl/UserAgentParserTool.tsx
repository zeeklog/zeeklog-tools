'use client'

import { UAParser } from 'ua-parser-js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

type ParsedUa = ReturnType<typeof UAParser>

function parseUa(userAgent: string): ParsedUa {
  if (userAgent.trim().length === 0) {
    return { ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as ParsedUa
  }
  return UAParser(userAgent.trim())
}

type Row = { label: string; value: string }

function sectionRows(result: ParsedUa): { heading: string; rows: Row[] }[] {
  return [
    {
      heading: 'Browser',
      rows: [
        { label: 'Name', value: result.browser?.name ?? '—' },
        { label: 'Version', value: result.browser?.version ?? '—' },
      ],
    },
    {
      heading: 'Engine',
      rows: [
        { label: 'Name', value: result.engine?.name ?? '—' },
        { label: 'Version', value: result.engine?.version ?? '—' },
      ],
    },
    {
      heading: 'OS',
      rows: [
        { label: 'Name', value: result.os?.name ?? '—' },
        { label: 'Version', value: result.os?.version ?? '—' },
      ],
    },
    {
      heading: 'Device',
      rows: [
        { label: 'Model', value: result.device?.model ?? '—' },
        { label: 'Type', value: result.device?.type ?? '—' },
        { label: 'Vendor', value: result.device?.vendor ?? '—' },
      ],
    },
    {
      heading: 'CPU',
      rows: [{ label: 'Architecture', value: result.cpu?.architecture ?? '—' }],
    },
  ]
}

export function UserAgentParserTool() {
  const [ua, setUa] = useState('')
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    setUa((prev) => (prev === '' ? navigator.userAgent : prev))
  }, [])

  const result = useMemo(() => parseUa(ua), [ua])
  const sections = useMemo(() => sectionRows(result), [result])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        User-Agent 字符串
        <ToolCodeMirror
          value={ua}
          onChange={setUa}
          rows={3}
          language="plaintext"
          variant="in"
          placeholder="默认使用当前浏览器的 UA，可改为任意字符串"
          className="text-xs [&_.cm-content]:text-xs"
        />
      </label>
      <div
        ref={outRef}
        tabIndex={-1}
        className="grid gap-4 outline-none focus:ring-2 focus:ring-orange-100 sm:grid-cols-2"
      >
        {sections.map((sec) => (
          <div key={sec.heading} className="rounded-xl border border-gray-100 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">{sec.heading}</h3>
            <dl className="space-y-1 text-sm">
              {sec.rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-2">
                  <dt className="text-gray-500">{r.label}</dt>
                  <dd className="text-right font-mono text-gray-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </ToolShortcutArea>
  )
}
