'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function CameraRecorderTool() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [err, setErr] = useState('')

  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    if (videoRef.current) videoRef.current.srcObject = null
  }, [stream])

  const start = async () => {
    setErr('')
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : '无法访问摄像头')
    }
  }

  useEffect(() => () => stop(), [stop])

  const capture = () => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    const c = document.createElement('canvas')
    c.width = v.videoWidth
    c.height = v.videoHeight
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.drawImage(v, 0, 0)
    c.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `capture-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {!stream ? (
          <button type="button" onClick={() => void start()} className="rounded bg-orange-500 px-4 py-2 text-sm text-white">
            开启摄像头
          </button>
        ) : (
          <>
            <button type="button" onClick={capture} className="rounded border px-4 py-2 text-sm">
              抓拍 PNG
            </button>
            <button type="button" onClick={stop} className="rounded border px-4 py-2 text-sm">
              停止
            </button>
          </>
        )}
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <video ref={videoRef} playsInline muted className="max-h-[480px] w-full rounded-lg bg-black object-contain" />
    </div>
  )
}
