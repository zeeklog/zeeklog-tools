'use client'

import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useToolLocale } from '@/components/tools/tool-locale'

function wifiString(ssid: string, password: string, security: string, hidden: boolean): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:')
  return `WIFI:T:${security};S:${esc(ssid)};P:${esc(password)};H:${hidden ? 'true' : 'false'};;`
}

export function WifiQrcodeGeneratorTool() {
  const locale = useToolLocale()
  const [ssid, setSsid] = useState('MyNetwork')
  const [password, setPassword] = useState('secret')
  const [security, setSecurity] = useState('WPA')
  const [hidden, setHidden] = useState(false)
  const [dataUrl, setDataUrl] = useState('')

  const payload = wifiString(ssid, password, security, hidden)

  useEffect(() => {
    void QRCode.toDataURL(payload, { width: 256, margin: 2 }).then(setDataUrl)
  }, [payload])

  return (
    <div className="mx-auto max-w-md space-y-4">
      <input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="SSID" className="w-full rounded border px-2 py-1 text-sm" />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={locale === 'zh' ? '密码' : 'Password'}
        type="password"
        className="w-full rounded border px-2 py-1 text-sm"
      />
      <select value={security} onChange={(e) => setSecurity(e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="nopass">{locale === 'zh' ? '无密码' : 'No password'}</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
        {locale === 'zh' ? '隐藏网络' : 'Hidden network'}
      </label>
      <pre className="break-all rounded bg-gray-50 p-2 font-mono text-xs">{payload}</pre>
      {dataUrl && <img src={dataUrl} alt="wifi qr" className="mx-auto" />}
    </div>
  )
}
