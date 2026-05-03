import type { Extension } from '@codemirror/state'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { StreamLanguage } from '@codemirror/language'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { toml as tomlMode } from '@codemirror/legacy-modes/mode/toml'
import { yaml as yamlMode } from '@codemirror/legacy-modes/mode/yaml'

/** 工具页 CodeMirror 语言标识（映射到语法高亮扩展） */
export type ToolCodemirrorLang =
  | 'plaintext'
  | 'json'
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'html'
  | 'css'
  | 'xml'
  | 'sql'
  | 'markdown'
  | 'yaml'
  | 'toml'
  | 'shell'

export function toolCodemirrorLanguageExtensions(lang: ToolCodemirrorLang): Extension[] {
  switch (lang) {
    case 'json':
      return [json()]
    case 'javascript':
      return [javascript({ jsx: false, typescript: false })]
    case 'typescript':
      return [javascript({ jsx: false, typescript: true })]
    case 'jsx':
      return [javascript({ jsx: true, typescript: false })]
    case 'tsx':
      return [javascript({ jsx: true, typescript: true })]
    case 'html':
      return [html()]
    case 'css':
      return [css()]
    case 'xml':
      return [xml()]
    case 'sql':
      return [sql()]
    case 'markdown':
      return [markdown()]
    case 'yaml':
      return [StreamLanguage.define(yamlMode)]
    case 'toml':
      return [StreamLanguage.define(tomlMode)]
    case 'shell':
      return [StreamLanguage.define(shell)]
    case 'plaintext':
    default:
      return []
  }
}
