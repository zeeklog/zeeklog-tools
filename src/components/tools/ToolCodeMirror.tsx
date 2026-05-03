'use client'

import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { githubDark } from '@uiw/codemirror-theme-github'
import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import type { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup'
import clsx from 'clsx'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  toolCodemirrorLanguageExtensions,
  type ToolCodemirrorLang,
} from '@/components/tools/tool-codemirror-lang'
import {
  toolCodeMirrorWrapInClass,
  toolCodeMirrorWrapOutClass,
} from '@/components/tools/tool-field-classes'

export type ToolCodeEditorHandle = {
  focus: () => void
}

export type ToolCodeMirrorProps = {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  /** 近似原 `textarea` 行数，用于换算最小高度 */
  rows?: number
  language: ToolCodemirrorLang
  /** 输入框样式 vs 只读输出样式（边框与外层容器） */
  variant?: 'in' | 'out'
  className?: string
  /** 追加扩展 */
  extraExtensions?: Extension[]
  basicSetup?: boolean | BasicSetupOptions
  indentWithTab?: boolean
  autoFocus?: boolean
  placeholder?: string
}

function rowsToMinHeight(rows: number): string {
  const r = Math.max(4, rows)
  return `${r * 1.45}rem`
}

export const ToolCodeMirror = forwardRef<ToolCodeEditorHandle, ToolCodeMirrorProps>(
  function ToolCodeMirror(props, ref) {
    const {
      value,
      onChange,
      readOnly = false,
      rows = 12,
      language,
      variant = 'in',
      className,
      extraExtensions = [],
      basicSetup = { lineNumbers: true, foldGutter: true },
      indentWithTab = true,
      autoFocus,
      placeholder,
    } = props

    const cmRef = useRef<ReactCodeMirrorRef>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        cmRef.current?.view?.focus()
      },
    }))

    const extensions: Extension[] = [
      ...toolCodemirrorLanguageExtensions(language),
      EditorView.lineWrapping,
      ...extraExtensions,
    ]

    const wrapClass = variant === 'out' ? toolCodeMirrorWrapOutClass : toolCodeMirrorWrapInClass
    const minH = rowsToMinHeight(rows)

    return (
      <div className={clsx(wrapClass, className)}>
        <CodeMirror
          ref={cmRef}
          value={value}
          theme={githubDark}
          extensions={extensions}
          editable={!readOnly}
          readOnly={readOnly}
          minHeight={minH}
          onChange={readOnly ? undefined : onChange}
          basicSetup={basicSetup}
          indentWithTab={indentWithTab}
          autoFocus={autoFocus}
          placeholder={placeholder}
        />
      </div>
    )
  },
)
