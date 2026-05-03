'use client'

import { useEffect, useState } from 'react'

type Snap = {
  screenAvail: string
  orientationType: string
  orientationAngle: string
  colorDepth: string
  pixelRatio: string
  windowSize: string
  vendor: string
  languages: string
  platform: string
  userAgent: string
}

function readSnap(): Snap {
  const sc = window.screen
  const or = sc.orientation
  return {
    screenAvail: `${sc.availWidth} × ${sc.availHeight}`,
    orientationType: or?.type ?? 'unknown',
    orientationAngle: `${or?.angle ?? 0}°`,
    colorDepth: `${sc.colorDepth} bits`,
    pixelRatio: `${window.devicePixelRatio} dppx`,
    windowSize: `${window.innerWidth} × ${window.innerHeight}`,
    vendor: navigator.vendor || '',
    languages: navigator.languages?.join(', ') ?? '',
    platform: navigator.platform || '',
    userAgent: navigator.userAgent || '',
  }
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-gray-100/80 px-4 py-3">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 break-all text-lg font-normal text-gray-900">
        {value ? value : <span className="text-gray-500">unknown</span>}
      </div>
    </div>
  )
}

export function DeviceInformationTool() {
  const [snap, setSnap] = useState<Snap | null>(null)

  useEffect(() => {
    const update = () => setSnap(readSnap())
    update()
    window.addEventListener('resize', update)
    window.screen.orientation?.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      window.screen.orientation?.removeEventListener('change', update)
    }
  }, [])

  if (!snap) {
    return <p className="text-sm text-gray-500">正在读取设备信息…</p>
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-base font-semibold text-orange-800">Screen</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="Screen size" value={snap.screenAvail} />
          <InfoBlock label="Orientation" value={snap.orientationType} />
          <InfoBlock label="Orientation angle" value={snap.orientationAngle} />
          <InfoBlock label="Color depth" value={snap.colorDepth} />
          <InfoBlock label="Pixel ratio" value={snap.pixelRatio} />
          <InfoBlock label="Window size" value={snap.windowSize} />
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-base font-semibold text-orange-800">Device</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="Browser vendor" value={snap.vendor} />
          <InfoBlock label="Languages" value={snap.languages} />
          <InfoBlock label="Platform" value={snap.platform} />
          <InfoBlock label="User agent" value={snap.userAgent} />
        </div>
      </section>
    </div>
  )
}
