#!/usr/bin/env node
/**
 * 启发式扫描 `src/components/tools/impl` 下「浏览器端」反模式：
 * - 含 `use client` 的文件直接 import Node 内置模块（fs/path/child_process 等），构建或运行易失败。
 * 仅作 CI 提示；个别工具若有意为之需单独列入忽略表。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const implDir = path.join(__dirname, '../src/components/tools/impl')

const NODE_BUILTIN =
  /(?:from\s+['"]|require\s*\(\s*['"])(fs|path|child_process|net|tls|dns)(?:\/|\/?['"])/

const hits = []

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name)
    if (name.isDirectory()) walk(p)
    else if (name.name.endsWith('.tsx') || name.name.endsWith('.ts')) {
      const src = fs.readFileSync(p, 'utf8')
      if (!src.includes("'use client'") && !src.includes('"use client"')) continue
      if (!NODE_BUILTIN.test(src)) continue
      const rel = path.relative(path.join(__dirname, '..'), p)
      hits.push(rel)
    }
  }
}

walk(implDir)

if (hits.length) {
  console.error('[audit-tools-impl-browser] 以下 use client 工具文件疑似直接引用 Node 内置模块，请在浏览器场景下复核：')
  for (const h of hits) console.error(' ', h)
  process.exit(1)
}

console.log('[audit-tools-impl-browser] OK：未发现 use client + Node 内置直连 import。')
