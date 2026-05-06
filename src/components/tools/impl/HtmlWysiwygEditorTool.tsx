'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import { useToolLocale } from '@/components/tools/tool-locale'
import '@/components/tools/tiptap-shell.css'

export function HtmlWysiwygEditorTool() {
  const locale = useToolLocale()
  const htmlOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const editor = useEditor({
    extensions: [StarterKit],
    content:
      locale === 'zh' ? '<p>在此编辑富文本，可复制生成的 HTML。</p>' : '<p>Edit rich text here, then copy generated HTML.</p>',
    immediatelyRender: false,
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) {
    return <p className="text-sm text-gray-500">{locale === 'zh' ? '编辑器加载中…' : 'Loading editor…'}</p>
  }

  const html = editor.getHTML()

  return (
    <ToolShortcutArea focusRef={htmlOutRef} className={`tiptap-editor-shell ${toolSectionClass}`}>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded border px-2 py-1 text-sm">
          {locale === 'zh' ? '粗体' : 'Bold'}
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded border px-2 py-1 text-sm">
          {locale === 'zh' ? '斜体' : 'Italic'}
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded border px-2 py-1 text-sm">
          {locale === 'zh' ? '列表' : 'List'}
        </button>
        <button type="button" onClick={() => void navigator.clipboard.writeText(editor.getHTML())} className="rounded bg-orange-500 px-2 py-1 text-sm text-white">
          {locale === 'zh' ? '复制 HTML' : 'Copy HTML'}
        </button>
      </div>
      <EditorContent editor={editor} />
      <label className={toolLabelClass}>
        {locale === 'zh' ? '当前 HTML' : 'Current HTML'}
        <ToolCodeMirror ref={htmlOutRef} readOnly value={html} rows={8} language="html" variant="out" className="[&_.cm-content]:text-xs" />
      </label>
    </ToolShortcutArea>
  )
}
