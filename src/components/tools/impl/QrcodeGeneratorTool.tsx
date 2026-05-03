'use client'

import QRCode from 'qrcode'
import { useEffect, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror } from '@/components/tools/ToolCodeMirror'
import { toolSectionClass } from '@/components/tools/tool-field-classes'

export function QrcodeGeneratorTool() {
  const [text, setText] = useState('https://example.com')
  const [dataUrl, setDataUrl] = useState('')
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void QRCode.toDataURL(text || ' ', { width: 256, margin: 2 }).then(setDataUrl)
  }, [text])

  return (
    <ToolShortcutArea focusRef={outRef} className={`mx-auto max-w-md ${toolSectionClass} text-center`}>
      <ToolCodeMirror value={text} onChange={setText} rows={4} language="plaintext" variant="in" />
      <div ref={outRef} tabIndex={-1} className="outline-none focus:ring-2 focus:ring-orange-100">
        {dataUrl ? <img src={dataUrl} alt="qr" className="mx-auto" /> : null}
      </div>
    </ToolShortcutArea>
  )
}
