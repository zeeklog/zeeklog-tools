'use client'

import bcrypt from 'bcryptjs'
import { useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolInputClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function BcryptTool() {
  const [plain, setPlain] = useState('')
  const [rounds, setRounds] = useState(10)
  const [hashIn, setHashIn] = useState('')
  const [comparePlain, setComparePlain] = useState('')
  const [generated, setGenerated] = useState('')
  const [compareResult, setCompareResult] = useState<'idle' | 'match' | 'nomatch'>('idle')
  const hashOutRef = useRef<HTMLPreElement>(null)
  const compareFocusRef = useRef<HTMLDivElement>(null)

  const doHash = () => {
    const salt = bcrypt.genSaltSync(rounds)
    setGenerated(bcrypt.hashSync(plain, salt))
  }

  const doCompare = () => {
    if (!hashIn || !comparePlain) {
      setCompareResult('idle')
      return
    }
    setCompareResult(bcrypt.compareSync(comparePlain, hashIn) ? 'match' : 'nomatch')
  }

  return (
    <div className="space-y-10">
      <ToolShortcutArea
        className={toolSectionClass}
        run={doHash}
        canRun={plain.trim() !== ''}
        focusRef={hashOutRef}
      >
        <h2 className="font-semibold text-gray-900">生成哈希</h2>
        <input
          value={plain}
          onChange={(e) => setPlain(e.target.value)}
          placeholder="密码明文"
          className={toolInputClass}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          轮数 (cost)
          <input
            type="number"
            min={4}
            max={15}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-20 rounded border border-gray-200 px-2 py-1"
          />
        </label>
        <button type="button" onClick={doHash} className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">
          生成 bcrypt
        </button>
        <pre
          ref={hashOutRef}
          tabIndex={-1}
          className={generated ? 'overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs' : 'sr-only'}
        >
          {generated}
        </pre>
      </ToolShortcutArea>

      <ToolShortcutArea
        className={toolSectionClass}
        run={doCompare}
        canRun={Boolean(hashIn.trim() && comparePlain)}
        focusRef={compareFocusRef}
      >
        <h2 className="font-semibold text-gray-900">校验</h2>
        <input
          value={comparePlain}
          onChange={(e) => setComparePlain(e.target.value)}
          placeholder="明文"
          className={toolInputClass}
        />
        <ToolCodeMirror
          value={hashIn}
          onChange={setHashIn}
          placeholder="bcrypt 哈希"
          rows={2}
          language="plaintext"
          variant="in"
        />
        <button type="button" onClick={doCompare} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          比较
        </button>
        <div ref={compareFocusRef} tabIndex={-1} className="min-h-[1.5rem] outline-none">
          {compareResult === 'match' && <p className="text-green-600">匹配</p>}
          {compareResult === 'nomatch' && <p className="text-red-600">不匹配</p>}
        </div>
      </ToolShortcutArea>
    </div>
  )
}
