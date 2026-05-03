'use client'

import { generateMeta } from '@it-tools/oggen'
import { useMemo, useRef, useState } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolConverterEditorGridClass, toolInputClass, toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'

export function OgMetaGeneratorTool() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [type, setType] = useState('website')
  const [twCard, setTwCard] = useState('summary_large_image')
  const outRef = useRef<ToolCodeEditorHandle | null>(null)

  const html = useMemo(() => {
    return generateMeta(
      {
        title,
        description,
        url,
        image,
        type,
        twitter: { card: twCard },
      },
      { generateTwitterCompatibleMeta: true },
    )
  }, [title, description, url, image, type, twCard])

  return (
    <ToolShortcutArea focusRef={outRef} className={toolSectionClass}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" className={toolInputClass} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="url" className={toolInputClass} />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="image" className={toolInputClass} />
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="og:type" className={toolInputClass} />
        <input value={twCard} onChange={(e) => setTwCard(e.target.value)} placeholder="twitter:card" className={toolInputClass} />
      </div>
      <div className={toolConverterEditorGridClass}>
        <label className={toolLabelClass}>
          description
          <ToolCodeMirror
            value={description}
            onChange={setDescription}
            placeholder="description"
            rows={3}
            language="plaintext"
            variant="in"
          />
        </label>
        <label className={toolLabelClass}>
          HTML meta
          <ToolCodeMirror
            ref={outRef}
            readOnly
            value={html}
            rows={14}
            language="html"
            variant="out"
            className="text-xs [&_.cm-content]:text-xs"
          />
        </label>
      </div>
      <button type="button" onClick={() => void navigator.clipboard.writeText(html)} className="rounded bg-orange-500 px-3 py-1.5 text-sm text-white">
        复制 HTML
      </button>
    </ToolShortcutArea>
  )
}
