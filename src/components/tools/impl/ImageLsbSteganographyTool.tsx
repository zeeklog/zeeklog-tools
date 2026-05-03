'use client'

import { useCallback, useState } from 'react'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import {
  decodeTextFromImageData,
  encodeTextIntoImageData,
  maxHiddenUtf8Bytes,
} from '@/lib/tools/logic/image-lsb-steganography'

export type ImageLsbSteganographyToolProps = {
  initialTab?: 'encode' | 'decode'
}

export function ImageLsbSteganographyTool({ initialTab = 'encode' }: ImageLsbSteganographyToolProps = {}) {
  const [tab, setTab] = useState<'encode' | 'decode'>(initialTab)
  const [text, setText] = useState('')
  const [outUrl, setOutUrl] = useState<string | null>(null)
  const [cap, setCap] = useState<number | null>(null)
  const [decoded, setDecoded] = useState('')
  const [err, setErr] = useState('')

  const onEncodeFile = useCallback(
    async (file: File | null) => {
      setErr('')
      setOutUrl((u) => {
        if (u) URL.revokeObjectURL(u)
        return null
      })
      if (!file || file.type !== 'image/png') {
        setCap(null)
        setErr('请使用 PNG 图片（无损，隐写数据会被 JPEG 破坏）')
        return
      }
      try {
        const bmp = await createImageBitmap(file)
        const c = document.createElement('canvas')
        c.width = bmp.width
        c.height = bmp.height
        const ctx = c.getContext('2d')
        if (!ctx) {
          setErr('Canvas 不可用')
          return
        }
        ctx.drawImage(bmp, 0, 0)
        bmp.close()
        const imageData = ctx.getImageData(0, 0, c.width, c.height)
        setCap(maxHiddenUtf8Bytes(imageData))
        encodeTextIntoImageData(imageData, text)
        ctx.putImageData(imageData, 0, 0)
        const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('blob'))), 'image/png'))
        setOutUrl(URL.createObjectURL(blob))
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e))
      }
    },
    [text],
  )

  const onDecodeFile = useCallback(async (file: File | null) => {
    setErr('')
    setDecoded('')
    if (!file || file.type !== 'image/png') {
      setErr('请使用 PNG 图片')
      return
    }
    try {
      const bmp = await createImageBitmap(file)
      const c = document.createElement('canvas')
      c.width = bmp.width
      c.height = bmp.height
      const ctx = c.getContext('2d')
      if (!ctx) {
        setErr('Canvas 不可用')
        return
      }
      ctx.drawImage(bmp, 0, 0)
      bmp.close()
      const imageData = ctx.getImageData(0, 0, c.width, c.height)
      setDecoded(decodeTextFromImageData(imageData))
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }, [])

  return (
    <div className={toolSectionClass}>
      <p className="text-sm text-amber-800">
        说明：仅在 PNG 中隐藏或读取短文本，不具备保密强度；请勿存放敏感信息。
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${tab === 'encode' ? 'bg-orange-600 text-white' : 'bg-slate-100'}`}
          onClick={() => setTab('encode')}
        >
          写入文本
        </button>
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${tab === 'decode' ? 'bg-orange-600 text-white' : 'bg-slate-100'}`}
          onClick={() => setTab('decode')}
        >
          读取文本
        </button>
      </div>
      {tab === 'encode' && (
        <>
          <label className={toolLabelClass}>
            隐藏文本
            <ToolCodeMirror value={text} onChange={setText} rows={4} language="plaintext" variant="in" />
          </label>
          {cap !== null && <p className="text-sm text-slate-600">约可承载 UTF-8 字节数上限（估算）：{cap}</p>}
          <label className={toolLabelClass}>
            载体 PNG
            <input type="file" accept="image/png" className="mt-1 block text-sm" onChange={(e) => void onEncodeFile(e.target.files?.[0] ?? null)} />
          </label>
        </>
      )}
      {tab === 'decode' && (
        <label className={toolLabelClass}>
          含隐写 PNG
          <input type="file" accept="image/png" className="mt-1 block text-sm" onChange={(e) => void onDecodeFile(e.target.files?.[0] ?? null)} />
        </label>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {tab === 'encode' && outUrl && (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outUrl} alt="stego" className="max-h-48 max-w-full rounded border border-slate-200" />
          <a href={outUrl} download="stego.png" className="mt-2 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm text-white">
            下载 PNG
          </a>
        </div>
      )}
      {tab === 'decode' && decoded !== '' && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-800">解析结果</p>
          <pre className="mt-1 whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-3 text-sm">{decoded}</pre>
        </div>
      )}
    </div>
  )
}
