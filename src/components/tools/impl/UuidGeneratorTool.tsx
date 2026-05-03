'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'
import { NIL as nilUuid, v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, validate as validateUuid } from 'uuid'

const VERSIONS = ['NIL', 'v1', 'v3', 'v4', 'v5'] as const
type UuidVersion = (typeof VERSIONS)[number]

const NAMESPACE_PRESETS = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(1)
  const [namespace, setNamespace] = useState<string>(NAMESPACE_PRESETS.URL)
  const [name, setName] = useState('')
  const [tick, setTick] = useState(0)
  const [copyHint, setCopyHint] = useState('')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const { output, error } = useMemo(() => {
    try {
      const n = Math.min(50, Math.max(1, count))
      const generators: Record<UuidVersion, (index: number) => string> = {
        NIL: () => nilUuid,
        v1: (index: number) =>
          generateUuidV1({
            clockseq: index,
            msecs: Date.now(),
            nsecs: Math.floor(Math.random() * 10000),
            node: Uint8Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)),
          }),
        v3: () => {
          if (!name.trim()) {
            throw new Error('v3 需要提供 Name')
          }
          if (!validateUuid(namespace)) {
            throw new Error('Namespace 不是合法 UUID')
          }
          return generateUuidV3(name, namespace)
        },
        v4: () => generateUuidV4(),
        v5: () => {
          if (!name.trim()) {
            throw new Error('v5 需要提供 Name')
          }
          if (!validateUuid(namespace)) {
            throw new Error('Namespace 不是合法 UUID')
          }
          return generateUuidV5(name, namespace)
        },
      }

      const gen = generators[version] ?? generators.NIL
      const lines: string[] = []
      for (let i = 0; i < n; i++) {
        lines.push(gen(i))
      }
      return { output: lines.join('\n'), error: null as string | null }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '生成失败'
      return { output: '', error: msg }
    }
  }, [version, count, namespace, name, tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const copy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopyHint('UUID 已复制')
    window.setTimeout(() => setCopyHint(''), 2000)
  }, [output])

  const nsInvalid = (version === 'v3' || version === 'v5') && namespace.length > 0 && !validateUuid(namespace)

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div>
        <span className="mb-2 block text-sm font-medium text-gray-700">UUID 版本</span>
        <div className="flex flex-wrap gap-2">
          {VERSIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVersion(v)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                version === v
                  ? 'border-orange-500 bg-orange-50 text-orange-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <span className="w-24 shrink-0">数量</span>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          className="w-24 rounded-md border border-gray-200 px-2 py-1 font-mono"
        />
      </label>

      {(version === 'v3' || version === 'v5') && (
        <div className="space-y-3 rounded-lg border border-orange-100 bg-orange-50/40 p-4">
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">Namespace 预设</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(NAMESPACE_PRESETS) as (keyof typeof NAMESPACE_PRESETS)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNamespace(NAMESPACE_PRESETS[key])}
                  className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:border-orange-300"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-700">Namespace（UUID）</span>
            <input
              type="text"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 font-mono text-sm ${
                nsInvalid ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {nsInvalid ? <span className="mt-1 block text-xs text-red-600">无效的 UUID</span> : null}
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="名称"
            />
          </label>
        </div>
      )}

      <ToolCodeMirror
        ref={outRef}
        readOnly
        value={output}
        rows={Math.min(12, Math.max(3, count))}
        language="plaintext"
        variant="out"
        placeholder="生成的 UUID"
        className="[&_.cm-content]:text-center"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          复制
        </button>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          刷新
        </button>
        {copyHint ? <span className="text-sm text-green-700">{copyHint}</span> : null}
      </div>
    </ToolShortcutArea>
  )
}
