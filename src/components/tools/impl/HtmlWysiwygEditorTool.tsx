'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { ToolShortcutArea } from '@/components/tools/ToolShortcutArea'
import { ToolCodeMirror, type ToolCodeEditorHandle } from '@/components/tools/ToolCodeMirror'
import { toolLabelClass, toolSectionClass } from '@/components/tools/tool-field-classes'
import '@/components/tools/tiptap-shell.css'

export function HtmlWysiwygEditorTool() {
  const htmlOutRef = useRef<ToolCodeEditorHandle | null>(null)
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>在此编辑富文本，可复制生成的 HTML。</p>',
    immediatelyRender: false,
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) {
    return <p className="text-sm text-gray-500">编辑器加载中…</p>
  }

  const html = editor.getHTML()

  return (
    <ToolShortcutArea focusRef={htmlOutRef} className={`tiptap-editor-shell ${toolSectionClass}`}>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded border px-2 py-1 text-sm">
          粗体
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded border px-2 py-1 text-sm">
          斜体
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded border px-2 py-1 text-sm">
          列表
        </button>
        <button type="button" onClick={() => void navigator.clipboard.writeText(editor.getHTML())} className="rounded bg-orange-500 px-2 py-1 text-sm text-white">
          复制 HTML
        </button>
      </div>
      <EditorContent editor={editor} />
      <label className={toolLabelClass}>
        当前 HTML
        <ToolCodeMirror ref={htmlOutRef} readOnly value={html} rows={8} language="html" variant="out" className="[&_.cm-content]:text-xs" />
      </label>
    </ToolShortcutArea>
  )
}
