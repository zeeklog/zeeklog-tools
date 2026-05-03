export type ParsedCurl = {
  method: string
  url: string
  headers: Record<string, string>
  body: string | null
  insecure: boolean
}

export type CurlParseResult =
  | { ok: true; data: ParsedCurl }
  | { ok: false; message: string }

function unquote(s: string): string {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    const inner = t.slice(1, -1)
    return inner.replace(/\\(.)/g, (_, c: string) => {
      if (c === 'n') return '\n'
      if (c === 'r') return '\r'
      if (c === 't') return '\t'
      return c
    })
  }
  return t
}

/**
 * 轻量解析常见 curl 片段（-X、-H、-d/--data*、URL 引号参数、-k）。
 * 不覆盖 curl 全部语法；无法解析时返回明确错误信息。
 */
export function parseCurlCommand(input: string): CurlParseResult {
  const raw = input.trim()
  if (raw === '') return { ok: false, message: '请输入 curl 命令' }
  if (!/^curl\s/i.test(raw)) {
    return { ok: false, message: '内容应以 curl 开头' }
  }

  let rest = raw.replace(/^curl\s+/i, '').trim()
  const headers: Record<string, string> = {}
  let method = 'GET'
  let body: string | null = null
  let insecure = false
  let url = ''

  const takeQuotedOrWord = (): string | null => {
    rest = rest.trimStart()
    if (!rest) return null
    const q = rest[0]
    if (q === '"' || q === "'") {
      let i = 1
      let out = ''
      while (i < rest.length) {
        const c = rest[i]
        if (c === '\\' && i + 1 < rest.length) {
          out += rest[i + 1]
          i += 2
          continue
        }
        if (c === q) {
          const token = q + out + q
          rest = rest.slice(i + 1).trimStart()
          return unquote(token)
        }
        out += c
        i++
      }
      return null
    }
    const m = /^(\S+)/.exec(rest)
    if (!m) return null
    rest = rest.slice(m[0].length).trimStart()
    return unquote(m[1])
  }

  while (rest.length > 0) {
    if (rest.startsWith('\\')) {
      rest = rest.slice(1).trimStart()
      continue
    }

    const flag = /^(-[a-zA-Z]|--[a-zA-Z-]+)/.exec(rest)
    if (!flag) {
      const token = takeQuotedOrWord()
      if (token && !url && !token.startsWith('-')) {
        url = token
      } else break
      continue
    }

    const name = flag[1]
    rest = rest.slice(name.length).trimStart()

    if (name === '-k' || name === '--insecure') {
      insecure = true
      continue
    }

    if (name === '-X' || name === '--request') {
      const v = takeQuotedOrWord()
      if (v) method = v.toUpperCase()
      continue
    }

    if (name === '-H' || name === '--header') {
      const v = takeQuotedOrWord()
      if (!v) return { ok: false, message: '-H 缺少值' }
      const idx = v.indexOf(':')
      if (idx === -1) return { ok: false, message: `无效的 Header：${v}` }
      const hk = v.slice(0, idx).trim()
      const hv = v.slice(idx + 1).trim()
      headers[hk] = hv
      continue
    }

    if (
      name === '-d' ||
      name === '--data' ||
      name === '--data-raw' ||
      name === '--data-binary' ||
      name === '--data-urlencode'
    ) {
      const v = takeQuotedOrWord()
      if (v == null) return { ok: false, message: `${name} 缺少值` }
      body = body == null ? v : `${body}&${v}`
      if (method === 'GET') method = 'POST'
      continue
    }

    if (name === '--url' || name === '-url') {
      const v = takeQuotedOrWord()
      if (v) url = v
      continue
    }

    if (name.startsWith('-') && name.length === 2 && name !== '--') {
      continue
    }

    // 未实现的选项不吞参数，避免误把 URL 当 flag 值丢掉
    continue
  }

  if (!url) return { ok: false, message: '未找到 URL' }

  return {
    ok: true,
    data: { method, url, headers, body, insecure },
  }
}

function headersObject(h: Record<string, string>): string {
  const keys = Object.keys(h)
  if (keys.length === 0) return '{}'
  const lines = keys.map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(h[k])},`)
  return `{\n${lines.join('\n')}\n  }`
}

export function parsedCurlToFetchJs(p: ParsedCurl): string {
  const opts: string[] = [`method: ${JSON.stringify(p.method)}`]
  const h = { ...p.headers }
  if (p.body != null && p.body !== '') {
    if (!Object.keys(h).some((k) => k.toLowerCase() === 'content-type')) {
      h['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    opts.push(`body: ${JSON.stringify(p.body)}`)
  }
  if (Object.keys(h).length > 0) {
    opts.push(`headers: ${headersObject(h).replace(/\n/g, '\n  ')}`)
  }
  const optStr = opts.length ? `, {\n  ${opts.join(',\n  ')}\n}` : ''
  let code = `const res = await fetch(${JSON.stringify(p.url)}${optStr})\nconst data = await res.text()`
  if (p.insecure) {
    code = `// 浏览器 fetch 无法跳过 TLS 校验；以下为 Node undici 示例（仅开发调试用）：\n// import { Agent } from 'undici'\n// dispatcher: new Agent({ connect: { rejectUnauthorized: false } })\n\n${code}`
  }
  return code
}

export function parsedCurlToAxiosTs(p: ParsedCurl): string {
  const head: string[] = ['import axios from \'axios\'', '']
  if (p.insecure) {
    head.push('// Node 开发环境可配合 https.Agent({ rejectUnauthorized: false })，生产勿用。', '')
  }
  const cfg: string[] = [`url: ${JSON.stringify(p.url)}`, `method: ${JSON.stringify(p.method.toLowerCase())}`]
  if (Object.keys(p.headers).length > 0) {
    cfg.push(`headers: ${headersObject(p.headers).replace(/\n/g, '\n  ')}`)
  }
  if (p.body != null && p.body !== '') {
    cfg.push(`data: ${JSON.stringify(p.body)}`)
  }
  return `${head.join('\n')}const res = await axios({\n  ${cfg.join(',\n  ')}\n})\nconsole.log(res.data)`
}

export function parsedCurlToPHP(p: ParsedCurl): string {
  const lines: string[] = ['<?php', '$ch = curl_init(' + JSON.stringify(p.url) + ');']
  lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${JSON.stringify(p.method)});`)
  if (Object.keys(p.headers).length > 0) {
    const hdr = Object.entries(p.headers).map(([k, v]) => `${JSON.stringify(k + ': ' + v)}`)
    lines.push(`curl_setopt($ch, CURLOPT_HTTPHEADER, [\n  ${hdr.join(',\n  ')}\n]);`)
  }
  if (p.body != null && p.body !== '') {
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(p.body)});`)
  }
  lines.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);')
  if (p.insecure) {
    lines.push('// 仅开发环境：curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);')
  }
  lines.push('$response = curl_exec($ch);', 'if ($response === false) {', '  throw new Exception(curl_error($ch));', '}', 'curl_close($ch);', 'echo $response;', '')
  return lines.join('\n')
}

export function parsedCurlToPythonRequests(p: ParsedCurl): string {
  const lines = ['import requests', '']
  const kw: string[] = []
  if (Object.keys(p.headers).length > 0) {
    kw.push(`headers=${JSON.stringify(p.headers, null, 4)}`)
  }
  if (p.body != null && p.body !== '') {
    kw.push(`data=${JSON.stringify(p.body)}`)
  }
  if (p.insecure) {
    kw.push('verify=False')
  }
  const suffix = kw.length > 0 ? `, ${kw.join(', ')}` : ''
  lines.push(`r = requests.request(${JSON.stringify(p.method)}, ${JSON.stringify(p.url)}${suffix})`)
  lines.push('print(r.text)')
  return lines.join('\n')
}
