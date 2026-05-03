/**
 * 使用浏览器 DOMParser 去除 HTML 标签，保留可见文本（script/style 内容会忽略）。
 * 仅在客户端调用。
 */
export function stripHtmlToPlainText(html: string): string {
  if (typeof document === 'undefined') {
    throw new Error('stripHtmlToPlainText 仅在浏览器环境可用')
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = doc.querySelectorAll('script, style, noscript')
  scripts.forEach((el) => el.remove())
  return doc.body?.innerText ?? ''
}
