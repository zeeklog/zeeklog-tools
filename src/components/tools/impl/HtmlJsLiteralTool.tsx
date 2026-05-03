'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { jsLiteralToText, textToJsDoubleQuoted, textToJsTemplateLiteral } from '@/lib/tools/logic/html-js-literal'

export function HtmlJsLiteralTool() {
  const [plain, setPlain] = useState('<div class="x">内容</div>')
  const [literalIn, setLiteralIn] = useState('`<div class=\\"x\\">内容</div>`')
  const tplOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const literalOutRef = useRef<ToolCodeEditorHandle | null>(null)

  const asTpl = useMemo(() => textToJsTemplateLiteral(plain), [plain])
  const asDq = useMemo(() => textToJsDoubleQuoted(plain), [plain])
  const fromLit = useMemo(() => jsLiteralToText(literalIn), [literalIn])

  return (
    <div className="space-y-6">
      <ToolShortcutArea focusRef={tplOutRef} showShortcutHint={false} className={toolSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">HTML / 文本 → JS 字符串字面量</h3>
        <div className={toolConverterEditorGridClass}>
          <div className="flex min-h-0 min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-800">HTML / 文本</span>
            <ToolCodeMirror value={plain} onChange={setPlain} rows={6} language="html" variant="in" />
          </div>
          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-500">模板字符串（已转义反引号与 {'${'} ）</p>
              <ToolCodeMirror
                ref={tplOutRef}
                readOnly
                value={asTpl}
                rows={3}
                language="javascript"
                variant="out"
                className="break-all text-xs [&_.cm-content]:text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-500">双引号字符串</p>
              <ToolCodeMirror
                readOnly
                value={asDq}
                rows={3}
                language="javascript"
                variant="out"
                className="break-all text-xs [&_.cm-content]:text-xs"
              />
            </div>
          </div>
        </div>
      </ToolShortcutArea>
      <ToolShortcutArea focusRef={literalOutRef} className={toolSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">JS 字面量 → 文本</h3>
        <div className={toolConverterEditorGridClass}>
          {!fromLit.ok && literalIn.trim() !== '' ? (
            <p className="text-sm text-red-600 lg:col-span-2">{fromLit.error}</p>
          ) : null}
          <label className="flex min-h-0 min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-800">
            JS 字面量
            <ToolCodeMirror
              value={literalIn}
              onChange={setLiteralIn}
              rows={4}
              language="javascript"
              variant="in"
              placeholder='`...` 或 "..."'
            />
          </label>
          <label className="flex min-h-0 min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-800">
            文本
            <ToolCodeMirror
              ref={literalOutRef}
              readOnly
              value={fromLit.ok ? fromLit.text : ''}
              rows={6}
              language="plaintext"
              variant="out"
            />
          </label>
        </div>
      </ToolShortcutArea>
    </div>
  )
}
