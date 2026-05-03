'use client'

import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function DockerRunToDockerComposeConverterTool() {
  const [raw, setRaw] = useState('docker run -p 80:80 nginx')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const seq = useRef(0)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  useEffect(() => {
    const id = ++seq.current
    if (raw.trim() === '') {
      setOut('')
      setErr('')
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      void (async () => {
        const res = await fetch('/api/tools/composerize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw }),
        })
        const data = (await res.json()) as { yaml?: string; error?: string }
        if (seq.current !== id) return
        setLoading(false)
        setOut(data.yaml ?? '')
        setErr(data.error ?? '')
      })()
    }, 400)
    return () => clearTimeout(t)
  }, [raw])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className={toolConverterEditorGridClass}>
        {loading && <p className="text-sm text-gray-500 lg:col-span-2">转换中…</p>}
        {err && <p className="text-sm text-red-600 lg:col-span-2">{err}</p>}
        <label className="block text-sm font-medium text-slate-800">
          docker run
          <ToolCodeMirror value={raw} onChange={setRaw} rows={6} language="shell" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          docker-compose.yml
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={18} language="yaml" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
