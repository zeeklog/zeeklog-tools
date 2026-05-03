'use client'

import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { type ListConvertOptions, convertList } from '@/lib/tools/logic/list-convert'

const defaultOpts: ListConvertOptions = {
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  separator: ', ',
}

export function ListConverterTool() {
  const [input, setInput] = useState('a\nb\nc')
  const [opts, setOpts] = useState<ListConvertOptions>(defaultOpts)
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const out = useMemo(() => convertList(input, opts), [input, opts])

  const toggle = (k: keyof ListConvertOptions) => {
    if (k === 'sortList') return
    const v = opts[k]
    if (typeof v === 'boolean') {
      setOpts((o) => ({ ...o, [k]: !v }))
    }
  }

  return (
    <ToolShortcutArea focusRef={outRef} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 text-sm text-slate-800">
          {(
            [
              ['trimItems', '修剪行首尾空白'],
              ['removeDuplicates', '去重'],
              ['lowerCase', '全文小写'],
              ['keepLineBreaks', '保留换行'],
              ['reverseList', '反转顺序'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={opts[key] as boolean} onChange={() => toggle(key)} />
              {label}
            </label>
          ))}
        </div>
        <div className="space-y-2 text-sm text-slate-800">
          <label className="block font-medium">
            排序
            <select
              value={opts.sortList ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setOpts((o) => ({ ...o, sortList: v === '' ? null : (v as 'asc' | 'desc') }))
              }}
              disabled={opts.reverseList}
              className="ml-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              <option value="">不排序</option>
              <option value="asc">升序</option>
              <option value="desc">降序</option>
            </select>
          </label>
          <label className="block font-medium">
            分隔符
            <input
              value={opts.separator}
              onChange={(e) => setOpts((o) => ({ ...o, separator: e.target.value }))}
              className="ml-2 w-32 rounded-xl border border-slate-200 px-2 py-1.5 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="项前缀"
              value={opts.itemPrefix}
              onChange={(e) => setOpts((o) => ({ ...o, itemPrefix: e.target.value }))}
              className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            />
            <input
              placeholder="项后缀"
              value={opts.itemSuffix}
              onChange={(e) => setOpts((o) => ({ ...o, itemSuffix: e.target.value }))}
              className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="列表前缀"
              value={opts.listPrefix}
              onChange={(e) => setOpts((o) => ({ ...o, listPrefix: e.target.value }))}
              className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            />
            <input
              placeholder="列表后缀"
              value={opts.listSuffix}
              onChange={(e) => setOpts((o) => ({ ...o, listSuffix: e.target.value }))}
              className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>
      <div className={toolConverterEditorGridClass}>
        <label className="block text-sm font-medium text-slate-800">
          输入
          <ToolCodeMirror value={input} onChange={setInput} rows={8} language="plaintext" variant="in" />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          输出
          <ToolCodeMirror ref={outRef} readOnly value={out} rows={8} language="plaintext" variant="out" />
        </label>
      </div>
    </ToolShortcutArea>
  )
}
