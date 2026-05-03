'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { convertUnit, type UnitDimension, unitsForDimension } from '@/lib/tools/logic/unit-convert'

const DIM_LABEL: Record<UnitDimension, string> = {
  length: '长度',
  mass: '质量',
  volume: '体积',
  area: '面积',
  time: '时间',
}

export function UnitConverterTool() {
  const [dim, setDim] = useState<UnitDimension>('length')
  const [fromU, setFromU] = useState('m')
  const [toU, setToU] = useState('km')
  const [val, setVal] = useState('1000')

  const units = useMemo(() => unitsForDimension(dim), [dim])
  const out = useMemo(() => {
    const n = Number.parseFloat(val.replace(/,/g, ''))
    if (!Number.isFinite(n)) return '—'
    const r = convertUnit(n, dim, fromU, toU)
    return r == null ? '—' : String(r)
  }, [val, dim, fromU, toU])

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        常用工程单位互转。Unix 时间戳与日期字符串请用{' '}
        <Link href="/tools/date-converter" className="text-orange-700 underline">
          日期时间转换器
        </Link>
        。
      </p>
      <div className={`${toolSectionClass} max-w-xl`}>
        <label className={toolLabelClass}>
          物理量
          <select
            value={dim}
            onChange={(e) => {
              const d = e.target.value as UnitDimension
              setDim(d)
              const u = unitsForDimension(d)
              setFromU(u[0]!)
              setToU(u[1] ?? u[0]!)
            }}
            className={toolInputClass}
          >
            {(Object.keys(DIM_LABEL) as UnitDimension[]).map((d) => (
              <option key={d} value={d}>
                {DIM_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={toolLabelClass}>
            从
            <select value={fromU} onChange={(e) => setFromU(e.target.value)} className={toolInputClass}>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
          <label className={toolLabelClass}>
            到
            <select value={toU} onChange={(e) => setToU(e.target.value)} className={toolInputClass}>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className={toolLabelClass}>
          数值
          <input value={val} onChange={(e) => setVal(e.target.value)} className={toolInputClass} inputMode="decimal" />
        </label>
        <p className="text-sm text-slate-800">
          结果：<span className="font-mono font-semibold">{out}</span> {toU}
        </p>
      </div>
    </div>
  )
}
