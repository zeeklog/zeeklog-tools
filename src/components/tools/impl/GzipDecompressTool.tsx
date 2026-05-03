'use client'

import { useMemo, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { decompressGzipOrZlib } from '@/lib/tools/logic/gzip-decompress'
import { assertInputWithinLimit } from '@/lib/tools/runtime-limits'

function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/\s/g, '')
  const bin = atob(clean)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function GzipDecompressTool() {
  const [b64, setB64] = useState('')
  const [hint, setHint] = useState('')
  const limitMsg = assertInputWithinLimit(b64)

  const { text, err, label } = useMemo(() => {
    if (limitMsg) return { text: '', err: '', label: '' as string }
    const t = b64.trim()
    if (!t) return { text: '', err: '', label: '' }
    try {
      const bytes = base64ToBytes(t)
      const r = decompressGzipOrZlib(bytes)
      if (!r.ok) return { text: '', err: r.message, label: '' }
      return { text: r.text, err: '', label: r.used === 'gzip' ? 'gzip' : 'zlib(raw deflate)' }
    } catch (e) {
      return { text: '', err: e instanceof Error ? e.message : String(e), label: '' }
    }
  }, [b64, limitMsg])

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        粘贴 <strong>Base64</strong> 编码的 gzip 或 zlib 压缩二进制。若解压结果乱码，说明内容非 UTF-8 文本。
      </p>
      <label className="text-sm">
        <input
          type="file"
          accept=".gz,application/gzip,application/octet-stream"
          className="mt-1 text-sm"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const r = new FileReader()
            r.onload = () => {
              const buf = r.result as ArrayBuffer
              const u = new Uint8Array(buf)
              let bin = ''
              for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]!)
              setB64(btoa(bin))
              setHint(`已载入文件 ${f.name}（${u.length} 字节）`)
            }
            r.readAsArrayBuffer(f)
          }}
        />
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {limitMsg && <p className="text-sm text-amber-800">{limitMsg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {label && <p className="text-xs text-green-700">检测到：{label}</p>}
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          Base64
          <ToolCodeMirror value={b64} onChange={setB64} rows={8} language="plaintext" variant="in" />
        </label>
        <label className={toolLabelClass}>
          解压文本（UTF-8）
          <ToolCodeMirror readOnly value={text} rows={14} language="plaintext" variant="out" />
        </label>
      </div>
    </div>
  )
}
