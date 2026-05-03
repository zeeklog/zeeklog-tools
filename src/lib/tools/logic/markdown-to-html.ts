import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

/** 同步将 Markdown 转为 HTML 片段（GFM、单换行按 marked breaks 处理） */
export function markdownToHtml(md: string): string {
  const out = marked.parse(md, { async: false })
  if (typeof out !== 'string') {
    throw new Error('marked: 预期同步返回字符串')
  }
  return out
}
