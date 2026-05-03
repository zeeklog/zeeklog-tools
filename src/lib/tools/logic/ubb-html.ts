/** 常见 UBB → HTML（论坛标签子集） */
export function ubbToHtml(ubb: string): string {
  let s = ubb
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  s = s.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
  s = s.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
  s = s.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
  s = s.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<del>$1</del>')
  s = s.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" rel="noopener noreferrer">$2</a>')
  s = s.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" rel="noopener noreferrer">$1</a>')
  s = s.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, '<img src="$1" alt="" loading="lazy" />')
  s = s.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, '<pre><code>$1</code></pre>')
  s = s.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote>$1</blockquote>')
  s = s.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, '<span style="color:$1">$2</span>')
  s = s.replace(/\[size=(\d+)\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size:$1px">$2</span>')

  s = s.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (_m, inner: string) => {
    const items = inner.split(/\[\*\]/).filter(Boolean)
    return '<ul>' + items.map((it) => `<li>${it.trim()}</li>`).join('') + '</ul>'
  })

  return s.replace(/\r\n/g, '\n').replace(/\n/g, '<br />\n')
}

/** 简化 HTML → UBB（仅处理本工具生成的常见标签） */
export function htmlToUbb(html: string): string {
  if (typeof document === 'undefined') {
    return htmlToUbbFromString(html)
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const body = doc.body
  return walkNodes(body).trim()
}

function walkNodes(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').replace(/\[/g, '［').replace(/\]/g, '］')
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const el = node as Element
  const tag = el.tagName.toLowerCase()
  const inner = Array.from(el.childNodes)
    .map((c) => walkNodes(c))
    .join('')

  switch (tag) {
    case 'strong':
    case 'b':
      return `[b]${inner}[/b]`
    case 'em':
    case 'i':
      return `[i]${inner}[/i]`
    case 'u':
      return `[u]${inner}[/u]`
    case 'del':
    case 's':
      return `[s]${inner}[/s]`
    case 'a': {
      const href = el.getAttribute('href') ?? ''
      return href ? `[url=${href}]${inner}[/url]` : inner
    }
    case 'img': {
      const src = el.getAttribute('src') ?? ''
      return src ? `[img]${src}[/img]` : ''
    }
    case 'pre':
      return `[code]${inner.replace(/<\/?code>/gi, '')}[/code]`
    case 'code':
      if (el.parentElement?.tagName.toLowerCase() === 'pre') return inner
      return `[code]${inner}[/code]`
    case 'blockquote':
      return `[quote]${inner}[/quote]`
    case 'br':
      return '\n'
    case 'p':
      return `${inner}\n`
    case 'ul':
      return (
        '[list]' +
        Array.from(el.querySelectorAll(':scope > li'))
          .map((li) => `[*]${walkNodes(li)}`)
          .join('') +
        '[/list]'
      )
    case 'li':
      return inner
    case 'span': {
      const style = el.getAttribute('style') ?? ''
      const color = /color:\s*([^;]+)/i.exec(style)?.[1]?.trim()
      if (color) return `[color=${color}]${inner}[/color]`
      const size = /font-size:\s*(\d+)px/i.exec(style)?.[1]
      if (size) return `[size=${size}]${inner}[/size]`
      return inner
    }
    case 'body':
    case 'div':
      return inner
    default:
      return inner
  }
}

/** 无 DOM 时的退化：正则粗转 */
function htmlToUbbFromString(html: string): string {
  return html
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '[b]$1[/b]')
    .replace(/<b>([\s\S]*?)<\/b>/gi, '[b]$1[/b]')
    .replace(/<em>([\s\S]*?)<\/em>/gi, '[i]$1[/i]')
    .replace(/<i>([\s\S]*?)<\/i>/gi, '[i]$1[/i]')
    .replace(/<u>([\s\S]*?)<\/u>/gi, '[u]$1[/u]')
    .replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[url=$1]$2[/url]')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}
