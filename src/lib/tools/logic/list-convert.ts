export type SortOrder = 'asc' | 'desc' | null

export interface ListConvertOptions {
  lowerCase: boolean
  trimItems: boolean
  itemPrefix: string
  itemSuffix: string
  listPrefix: string
  listSuffix: string
  reverseList: boolean
  sortList: SortOrder
  removeDuplicates: boolean
  separator: string
  keepLineBreaks: boolean
}

function byOrder(order: 'asc' | 'desc'): (a: string, b: string) => number {
  return (a, b) => (order === 'asc' ? a.localeCompare(b) : b.localeCompare(a))
}

export function convertList(list: string, options: ListConvertOptions): string {
  const lineBreak = options.keepLineBreaks ? '\n' : ''

  let text = options.lowerCase ? list.toLowerCase() : list
  let parts = text.split('\n')

  if (options.removeDuplicates) {
    parts = [...new Set(parts)]
  }
  if (options.reverseList) {
    parts = [...parts].reverse()
  }
  if (options.sortList !== null) {
    parts = [...parts].sort(byOrder(options.sortList))
  }
  if (options.trimItems) {
    parts = parts.map((p) => p.trim())
  }
  parts = parts.filter((p) => p !== '')

  const body = parts.map((p) => options.itemPrefix + p + options.itemSuffix).join(options.separator + lineBreak)

  return [options.listPrefix, body, options.listSuffix].join(lineBreak)
}
