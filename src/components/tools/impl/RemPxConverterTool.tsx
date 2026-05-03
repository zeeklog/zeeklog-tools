'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toolInputClass, toolLabelClass, toolSectionClass, toolInputReadonlyClass } from '@/components/tools/tool-field-classes'
import { emToPx, pxToEm, pxToRem, remToPx } from '@/lib/tools/logic/rem-px'

export function RemPxConverterTool() {
  const [rootPx, setRootPx] = useState(16)
  const [contextPx, setContextPx] = useState(16)
  const [remIn, setRemIn] = useState('1')
  const [pxIn, setPxIn] = useState('16')
  const [emIn, setEmIn] = useState('1')

  const remPx = useMemo(() => {
    const r = Number.parseFloat(remIn.replace(/,/g, ''))
    const out = remToPx(Number.isFinite(r) ? r : NaN, rootPx)
    return Number.isFinite(out) ? String(out) : '—'
  }, [remIn, rootPx])

  const pxRem = useMemo(() => {
    const px = Number.parseFloat(pxIn.replace(/,/g, ''))
    const out = pxToRem(Number.isFinite(px) ? px : NaN, rootPx)
    return Number.isFinite(out) ? out.toFixed(6).replace(/\.?0+$/, '') : '—'
  }, [pxIn, rootPx])

  const emPx = useMemo(() => {
    const e = Number.parseFloat(emIn.replace(/,/g, ''))
    const out = emToPx(Number.isFinite(e) ? e : NaN, contextPx)
    return Number.isFinite(out) ? String(out) : '—'
  }, [emIn, contextPx])

  const pxEm = useMemo(() => {
    const px = Number.parseFloat(pxIn.replace(/,/g, ''))
    const out = pxToEm(Number.isFinite(px) ? px : NaN, contextPx)
    return Number.isFinite(out) ? out.toFixed(6).replace(/\.?0+$/, '') : '—'
  }, [pxIn, contextPx])

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">REM / EM 与 PX 换算</h2>
        <p className="mt-2">
          REM 相对<strong>根元素</strong>字号（常见 <code className="rounded bg-white px-1 text-xs">html</code> 16px）；EM 相对<strong>当前元素</strong>父级字号。用于布局与稿对照。
        </p>
      </section>

      <div className={`${toolSectionClass} grid gap-6 sm:grid-cols-2`}>
        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <label className={toolLabelClass}>
            根字号（px）
            <input
              type="number"
              min={1}
              step={1}
              value={rootPx}
              onChange={(e) => setRootPx(Number(e.target.value))}
              className={toolInputClass}
            />
          </label>
          <label className={toolLabelClass}>
            rem → px
            <input value={remIn} onChange={(e) => setRemIn(e.target.value)} className={toolInputClass} inputMode="decimal" />
          </label>
          <p className="text-sm text-slate-600">
            结果：<span className="font-mono text-slate-900">{remPx}</span> px
          </p>
          <label className={toolLabelClass}>
            px → rem（同上根字号）
          </label>
          <input readOnly value={pxRem} className={toolInputReadonlyClass} />
        </div>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <label className={toolLabelClass}>
            参考字号 / 父级字号（px，用于 em）
            <input
              type="number"
              min={1}
              step={1}
              value={contextPx}
              onChange={(e) => setContextPx(Number(e.target.value))}
              className={toolInputClass}
            />
          </label>
          <label className={toolLabelClass}>
            em → px
            <input value={emIn} onChange={(e) => setEmIn(e.target.value)} className={toolInputClass} inputMode="decimal" />
          </label>
          <p className="text-sm text-slate-600">
            结果：<span className="font-mono text-slate-900">{emPx}</span> px
          </p>
          <label className={toolLabelClass}>
            px（与左侧相同输入框）→ em
          </label>
          <input readOnly value={pxEm} className={toolInputReadonlyClass} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
        <label className={toolLabelClass}>共用 px 输入（用于 px→rem / px→em）</label>
        <input value={pxIn} onChange={(e) => setPxIn(e.target.value)} className={toolInputClass} inputMode="decimal" />
      </div>

      <section className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">相关工具</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/tools/device-information"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              设备信息
            </Link>
          </li>
          <li>
            <Link
              href="/tools/color-converter"
              className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-1.5 text-orange-900 hover:border-orange-200"
            >
              颜色转换
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
