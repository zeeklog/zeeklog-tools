'use client'

import forge from 'node-forge'
import { useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function RsaKeyPairGeneratorTool() {
  const [bits, setBits] = useState(2048)
  const [pub, setPub] = useState('')
  const [priv, setPriv] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const pubRef = useRef<ToolCodeEditorHandle | null>(null)

  const generate = () => {
    setBusy(true)
    setErr('')
    setTimeout(() => {
      try {
        const pair = forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 })
        setPub(forge.pki.publicKeyToPem(pair.publicKey))
        setPriv(forge.pki.privateKeyToPem(pair.privateKey))
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e))
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolShortcutArea
      className={toolSectionClass}
      run={generate}
      canRun={!busy}
      focusRef={pubRef}
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-700">
          密钥长度
          <select
            value={bits}
            onChange={(e) => setBits(Number(e.target.value))}
            className="ml-2 rounded-lg border border-gray-200 px-2 py-1"
          >
            <option value={1024}>1024</option>
            <option value={2048}>2048</option>
            <option value={4096}>4096</option>
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {busy ? '生成中…' : '生成密钥对'}
        </button>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <label className={toolLabelClass}>
        公钥 PEM
        <ToolCodeMirror
          ref={pubRef}
          readOnly
          value={pub}
          rows={8}
          language="plaintext"
          variant="out"
          className="text-xs [&_.cm-content]:text-xs"
        />
      </label>
      <label className={toolLabelClass}>
        私钥 PEM
        <ToolCodeMirror
          readOnly
          value={priv}
          rows={12}
          language="plaintext"
          variant="out"
          className="text-xs [&_.cm-content]:text-xs"
        />
      </label>
    </ToolShortcutArea>
  )
}
