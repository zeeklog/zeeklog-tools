import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
})

turndown.use(gfm)

/**
 * 将 HTML 片段转为 Markdown（Turndown + GFM 插件：表格、删除线等）。
 * 在浏览器与 Node 中均可运行。
 */
export function htmlToMarkdown(html: string): string {
  const trimmed = html.trim()
  if (!trimmed) return ''
  return turndown.turndown(trimmed).trimEnd()
}
