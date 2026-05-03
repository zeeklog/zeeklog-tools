import { parse as parseToml, stringify as stringifyToml } from '@iarna/toml'
import JSON5 from 'json5'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

type TomlRoot = Parameters<typeof stringifyToml>[0]

export function yamlToJson(yamlStr: string): string {
  const obj = parseYaml(yamlStr)
  return obj === undefined || obj === null ? '' : JSON.stringify(obj, null, 3)
}

export function jsonToYaml(jsonStr: string): string {
  const obj = JSON5.parse(jsonStr)
  return stringifyYaml(obj, { indent: 2 })
}

export function yamlToToml(yamlStr: string): string {
  const obj = parseYaml(yamlStr)
  return stringifyToml(obj as TomlRoot)
}

export function tomlToYaml(tomlStr: string): string {
  const obj = parseToml(tomlStr)
  return stringifyYaml(obj, { indent: 2 })
}

export function tomlToJson(tomlStr: string): string {
  const obj = parseToml(tomlStr)
  return JSON.stringify(obj, null, 3)
}

export function jsonToToml(jsonStr: string): string {
  const obj = JSON5.parse(jsonStr)
  return stringifyToml(obj as TomlRoot)
}
