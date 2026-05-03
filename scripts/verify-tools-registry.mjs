#!/usr/bin/env node
/**
 * 静态校验：已声明「已实现」的工具必须已挂到 TOOL_LAZY_MAP（或走图片 SEO 独立入口），
 * 且主站 catalog 中应存在对应 slug。避免再出现仅写 implemented 未接 dynamic 的隐蔽故障。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8')
}

function parseImplementedSlugs(src) {
  const block = src.split('IMPLEMENTED_TOOL_SLUGS = new Set<string>([')[1]?.split('])')[0]
  if (!block) throw new Error('Could not parse IMPLEMENTED_TOOL_SLUGS')
  return [...block.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1])
}

function parseLazyMapKeys(src) {
  const m = src.match(/export const TOOL_LAZY_MAP[^=]*=\s*\{([^]+?)\n\}/s)
  if (!m) throw new Error('Could not parse TOOL_LAZY_MAP')
  return [...m[1].matchAll(/'([a-z0-9-]+)':/g)].map((x) => x[1])
}

function main() {
  const implementedSrc = read('src/lib/tools/implemented.ts')
  const dynamicSrc = read('src/components/tools/dynamic-tool-views.tsx')
  const catalogMain = JSON.parse(read('src/lib/tools/catalog.json'))
  const catalogImage = JSON.parse(read('src/lib/tools/catalog.image-seo.json'))

  const implemented = parseImplementedSlugs(implementedSrc)
  const lazyKeys = parseLazyMapKeys(dynamicSrc)
  const imageSlugs = new Set(catalogImage.map((t) => t.slug))
  const catalogSlugs = new Set([...catalogMain, ...catalogImage].map((t) => t.slug))

  const implementedSet = new Set(implemented)
  const lazySet = new Set(lazyKeys)

  const needLazy = implemented.filter((s) => !imageSlugs.has(s))
  const missingLazy = needLazy.filter((s) => !lazySet.has(s))
  const orphanLazy = lazyKeys.filter((s) => !implementedSet.has(s))

  const missingCatalog = implemented.filter((s) => !catalogSlugs.has(s))

  const errors = []
  if (missingLazy.length) {
    errors.push(`implemented 但未注册 TOOL_LAZY_MAP（且非图片 SEO）：\n  ${missingLazy.join('\n  ')}`)
  }
  if (orphanLazy.length) {
    errors.push(`TOOL_LAZY_MAP 中有但未出现在 implemented：\n  ${orphanLazy.join('\n  ')}`)
  }
  if (missingCatalog.length) {
    errors.push(`implemented 但未出现在 catalog.json / catalog.image-seo.json：\n  ${missingCatalog.join('\n  ')}`)
  }

  if (errors.length) {
    console.error('[verify-tools-registry] 失败\n')
    for (const e of errors) console.error(e + '\n')
    process.exit(1)
  }

  console.log(
    `[verify-tools-registry] OK：已实现 ${implemented.length} 个 slug；TOOL_LAZY_MAP ${lazyKeys.length} 项；需懒加载主工具 ${needLazy.length} 个。`,
  )
}

main()
