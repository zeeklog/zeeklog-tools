const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/** React 中需改名的 HTML 属性（小写名 -> JSX 属性名） */
const ATTR_MAP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  cellspacing: 'cellSpacing',
  cellpadding: 'cellPadding',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  hreflang: 'hrefLang',
  inputmode: 'inputMode',
  novalidate: 'noValidate',
  playsinline: 'playsInline',
  radiogroup: 'radioGroup',
  referrerpolicy: 'referrerPolicy',
  srcset: 'srcSet',
  usemap: 'useMap',
}

function mapAttrName(htmlName: string): string {
  const lower = htmlName.toLowerCase()
  return ATTR_MAP[lower] ?? lower
}

function escapeJsxText(text: string): string {
  if (text === '') return ''
  const parts: string[] = []
  let buf = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '{' || ch === '}') {
      if (buf) {
        parts.push(buf)
        buf = ''
      }
      parts.push(ch === '{' ? "{'{'}" : "{'}'}")
    } else {
      buf += ch
    }
  }
  if (buf) parts.push(buf)
  return parts.join('')
}

function formatAttrValue(name: string, value: string): string {
  if (name === 'style') {
    return `{${JSON.stringify(value)}}`
  }
  return `{${JSON.stringify(value)}}`
}

function elementToJsx(el: Element, indent: number): string {
  const tag = el.tagName.toLowerCase()
  if (tag === 'script' || tag === 'style') {
    return ''
  }

  const pad = '  '.repeat(indent)
  let attrStr = ''
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i]
    if (!a) continue
    const jsxName = mapAttrName(a.name)
    attrStr += ` ${jsxName}=${formatAttrValue(jsxName, a.value)}`
  }

  if (VOID_TAGS.has(tag)) {
    return `${pad}<${tag}${attrStr} />`
  }

  const childLines: string[] = []
  for (const child of el.childNodes) {
    const piece = nodeToJsx(child, indent + 1)
    if (piece) childLines.push(piece)
  }

  if (childLines.length === 0) {
    return `${pad}<${tag}${attrStr}></${tag}>`
  }
  return `${pad}<${tag}${attrStr}>\n${childLines.join('\n')}\n${pad}</${tag}>`
}

function nodeToJsx(node: Node, indent: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent ?? ''
    if (!t.trim()) return ''
    const pad = '  '.repeat(indent)
    return `${pad}${escapeJsxText(t)}`
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return elementToJsx(node as Element, indent)
  }
  return ''
}

/**
 * 将 HTML 片段转为 JSX 风格字符串（class→className、自闭合标签、文本中转义花括号）。
 * 仅在浏览器环境调用；复杂 style 对象、事件处理器等需人工调整。
 */
export function htmlFragmentToJsx(html: string): string {
  if (typeof document === 'undefined') {
    throw new Error('htmlFragmentToJsx 仅在浏览器环境可用')
  }
  const wrapped = `<div data-root="1">${html}</div>`
  const doc = new DOMParser().parseFromString(wrapped, 'text/html')
  const root = doc.querySelector('[data-root="1"]')
  if (!root) return ''
  const parts: string[] = []
  for (const child of root.childNodes) {
    const p = nodeToJsx(child, 0)
    if (p) parts.push(p)
  }
  return parts.join('\n')
}
