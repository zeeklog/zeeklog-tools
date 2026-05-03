'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  escapeCsvField,
  escapeCSharpString,
  escapeJsString,
  escapeSqlStringLiteral,
  escapeXmlText,
  javaNativeAsciiToText,
  textToJavaNativeAscii,
  unescapeJsLikeString,
  unescapeXmlText,
} from '@/lib/tools/logic/escape-sequences'

type Mode =
  | 'js-escape'
  | 'js-unescape'
  | 'native-encode'
  | 'native-decode'
  | 'xml-escape'
  | 'xml-unescape'
  | 'csv-escape'
  | 'csharp-escape'
  | 'sql-escape'

const MODE_BUTTONS: { k: Mode; label: string }[] = [
  { k: 'js-escape', label: 'JS 转义' },
  { k: 'js-unescape', label: 'JS 反转义' },
  { k: 'xml-escape', label: 'XML 转义' },
  { k: 'xml-unescape', label: 'XML 反转义' },
  { k: 'csv-escape', label: 'CSV 字段转义' },
  { k: 'csharp-escape', label: 'C# 字符串转义' },
  { k: 'sql-escape', label: 'SQL 单引号转义' },
  { k: 'native-encode', label: 'Java Native \\u 编码' },
  { k: 'native-decode', label: 'Java Native \\u 解码' },
]

export function EscapeNativeConverterTool() {
  const [mode, setMode] = useState<Mode>('js-escape')
  const [input, setInput] = useState('你好 "world"\\n')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const output = useMemo(() => {
    try {
      switch (mode) {
        case 'js-escape':
          return escapeJsString(input)
        case 'js-unescape':
          return unescapeJsLikeString(input)
        case 'native-encode':
          return textToJavaNativeAscii(input)
        case 'native-decode':
          return javaNativeAsciiToText(input)
        case 'xml-escape':
          return escapeXmlText(input)
        case 'xml-unescape':
          return unescapeXmlText(input)
        case 'csv-escape':
          return escapeCsvField(input)
        case 'csharp-escape':
          return escapeCSharpString(input)
        case 'sql-escape':
          return escapeSqlStringLiteral(input)
        default:
          return ''
      }
    } catch {
      return '（处理出错：请检查输入）'
    }
  }, [input, mode])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
  }

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <p className="text-sm text-slate-600">
        多语言 / 场景转义集中在一页；与 <span className="font-medium">HTML 实体</span>、<span className="font-medium">URL 编码</span> 等工具互补。
      </p>
      <div className="flex flex-wrap gap-2">
        {MODE_BUTTONS.map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${mode === k ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-gray-200 bg-white text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={toolConverterEditorGridClass}>
        <label className="block text-sm font-medium text-slate-800">
          输入
          <ToolCodeMirror value={input} onChange={setInput} rows={6} language="plaintext" variant="in" />
        </label>
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800">结果</h3>
            <button type="button" onClick={() => void copy()} className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-orange-900">
              复制
            </button>
          </div>
          <ToolCodeMirror ref={outRef} readOnly value={output} rows={6} language="plaintext" variant="out" />
        </div>
      </div>
    </ToolShortcutArea>
  )
}
