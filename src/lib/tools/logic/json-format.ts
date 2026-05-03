import JSON5 from 'json5'

export function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys) as unknown as T
  }

  return Object.keys(obj as object)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (sortedObj, key) => {
        sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
        return sortedObj
      },
      {} as Record<string, unknown>,
    ) as T
}

export function formatJsonString(rawJson: string, sortKeys: boolean, indentSize: number): string {
  const parsedObject = JSON5.parse(rawJson)
  return JSON.stringify(sortKeys ? sortObjectKeys(parsedObject) : parsedObject, null, indentSize)
}
