'use client'

import { colord } from 'colord'
import { useMemo, useState } from 'react'

export function ColorConverterTool() {
  const [hex, setHex] = useState('#ff6600')

  const info = useMemo(() => {
    const c = colord(hex)
    if (!c.isValid()) return null
    return {
      hex: c.toHex(),
      rgb: c.toRgbString(),
      hsl: c.toHslString(),
    }
  }, [hex])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <input type="color" value={info?.hex ?? '#000000'} onChange={(e) => setHex(e.target.value)} className="h-12 w-20 cursor-pointer rounded border" />
        <input value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1 rounded border px-3 py-2 font-mono text-sm" />
      </div>
      {!info && <p className="text-sm text-red-600">无效颜色</p>}
      {info && (
        <div className="space-y-2 rounded-xl border p-4" style={{ borderColor: info.hex }}>
          <div className="h-16 w-full rounded" style={{ backgroundColor: info.hex }} />
          <p className="font-mono text-sm">HEX {info.hex}</p>
          <p className="font-mono text-sm">RGB {info.rgb}</p>
          <p className="font-mono text-sm">HSL {info.hsl}</p>
        </div>
      )}
    </div>
  )
}
