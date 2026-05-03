'use client'

import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import {
  base32toHex,
  buildKeyUri,
  generateOtpSecret,
  generateTOTP,
} from '@/lib/tools/logic/otp'

export function OtpGeneratorTool() {
  const [secret, setSecret] = useState(() => generateOtpSecret())
  const [now, setNow] = useState(Date.now())
  const [qr, setQr] = useState('')

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(t)
  }, [])

  const keyUri = useMemo(() => buildKeyUri({ secret }), [secret])

  useEffect(() => {
    void QRCode.toDataURL(keyUri, { width: 210, margin: 1 }).then(setQr)
  }, [keyUri])

  const tokens = useMemo(
    () => ({
      prev: generateTOTP({ key: secret, now: now - 30_000 }),
      cur: generateTOTP({ key: secret, now }),
      next: generateTOTP({ key: secret, now: now + 30_000 }),
    }),
    [secret, now],
  )

  const interval = (now / 1000) % 30

  const secretOk = /^[A-Z2-7]+$/i.test(secret) && secret.length > 0

  return (
    <div className="mx-auto max-w-md space-y-4">
      <label className="block text-sm">
        Secret (Base32)
        <div className="mt-1 flex gap-2">
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, ''))}
            className="min-w-0 flex-1 rounded border px-2 py-1 font-mono text-sm"
          />
          <button type="button" onClick={() => setSecret(generateOtpSecret())} className="rounded border px-2 text-sm">
            刷新
          </button>
        </div>
      </label>
      {!secretOk && <p className="text-sm text-red-600">请输入有效 Base32 密钥</p>}
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-lg">
        <div>
          <div className="text-xs text-gray-500">上一窗口</div>
          {tokens.prev}
        </div>
        <div className="font-bold text-orange-600">
          <div className="text-xs text-gray-500">当前</div>
          {tokens.cur}
        </div>
        <div>
          <div className="text-xs text-gray-500">下一窗口</div>
          {tokens.next}
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${(100 * interval) / 30}%` }} />
      </div>
      <p className="text-center text-sm text-gray-600">下一窗口约 {Math.floor(30 - interval)}s</p>
      {qr && <img src={qr} alt="otp qr" className="mx-auto" />}
      <p className="break-all font-mono text-xs text-gray-600">{keyUri}</p>
      <p className="font-mono text-xs">Hex: {secretOk ? base32toHex(secret) : '—'}</p>
    </div>
  )
}
