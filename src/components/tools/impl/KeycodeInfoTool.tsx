'use client'

import { useEffect, useState } from 'react'

type KeyFields = { label: string; value: string; placeholder: string }[]

function buildFields(e: KeyboardEvent): KeyFields {
  return [
    { label: 'Key', value: e.key, placeholder: 'Key name…' },
    { label: 'Keycode（已废弃）', value: String(e.keyCode), placeholder: 'Keycode…' },
    { label: 'Code', value: e.code, placeholder: 'Code…' },
    { label: 'Location', value: String(e.location), placeholder: 'Location…' },
    {
      label: '修饰键',
      value: [e.metaKey && 'Meta', e.shiftKey && 'Shift', e.ctrlKey && 'Ctrl', e.altKey && 'Alt'].filter(Boolean).join(' + '),
      placeholder: '无',
    },
  ]
}

export function KeycodeInfoTool() {
  const [event, setEvent] = useState<KeyboardEvent | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setEvent(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const fields = event ? buildFields(event) : []

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-orange-100 bg-orange-50/40 py-12 text-center">
        {event ? (
          <div className="mb-2 text-3xl font-medium text-gray-900">{event.key}</div>
        ) : (
          <div className="mb-2 text-lg text-gray-500">—</div>
        )}
        <p className="text-sm text-gray-600 opacity-90">在键盘上按下任意键以查看 key / code / keycode 等信息</p>
      </div>

      {fields.map((row, i) => (
        <div key={i} className="flex flex-col gap-1 sm:flex-row sm:items-center">
          <span className="w-40 shrink-0 text-sm font-medium text-gray-600">{row.label}</span>
          <input
            type="text"
            readOnly
            value={row.value}
            placeholder={row.placeholder}
            className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900"
          />
        </div>
      ))}
    </div>
  )
}
