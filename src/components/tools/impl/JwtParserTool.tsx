'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { decodeJwt, type JwtClaimRow } from '@/lib/tools/logic/jwt-parser-logic'

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function JwtParserTool() {
  const [raw, setRaw] = useState(SAMPLE)
  const tablesRef = useRef<HTMLDivElement>(null)

  const { valid, decoded, errorMessage } = useMemo(() => {
    const empty: { header: JwtClaimRow[]; payload: JwtClaimRow[] } = { header: [], payload: [] }
    const trimmed = raw.trim()
    if (!trimmed) {
      return { valid: false, decoded: empty, errorMessage: '请输入 JWT' }
    }
    try {
      return { valid: true, decoded: decodeJwt({ jwt: trimmed }), errorMessage: '' }
    } catch (e) {
      return {
        valid: false,
        decoded: empty,
        errorMessage: e instanceof Error ? e.message : '无效的 JWT',
      }
    }
  }, [raw])

  return (
    <ToolShortcutArea focusRef={tablesRef} className={toolSectionClass}>
      <label className={toolLabelClass}>
        JWT（仅解码，不校验签名）
        <ToolCodeMirror
          value={raw}
          onChange={setRaw}
          rows={5}
          language="plaintext"
          variant="in"
          className="text-xs [&_.cm-content]:text-xs"
        />
      </label>
      {!valid && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div
        ref={tablesRef}
        tabIndex={-1}
        className={`outline-none focus:ring-2 focus:ring-orange-100 ${valid ? 'space-y-6 overflow-x-auto' : 'sr-only'}`}
      >
        {valid ? (
          <>
            <JwtTable title="Header" rows={decoded.header} />
            <JwtTable title="Payload" rows={decoded.payload} />
          </>
        ) : null}
      </div>
    </ToolShortcutArea>
  )
}

function JwtTable({
  title,
  rows,
}: {
  title: string
  rows: { claim: string; claimDescription?: string; value: string; friendlyValue?: string }[]
}) {
  return (
    <div>
      <h3 className="mb-2 text-center text-sm font-semibold text-gray-800">{title}</h3>
      <table className="w-full min-w-[480px] border border-gray-200 text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.claim + row.value.slice(0, 40)} className="border-t border-gray-100">
              <td className="align-top p-2 font-mono text-xs">
                <span className="font-bold">{row.claim}</span>
                {row.claimDescription ? <span className="ml-2 text-gray-500">({row.claimDescription})</span> : null}
              </td>
              <td className="p-2 font-mono text-xs break-all">
                <span>{row.value}</span>
                {row.friendlyValue ? <span className="ml-2 text-gray-500">({row.friendlyValue})</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
