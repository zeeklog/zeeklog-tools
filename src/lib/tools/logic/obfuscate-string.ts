export function obfuscateString(
  str: string,
  {
    replacementChar = '*',
    keepFirst = 4,
    keepLast = 0,
    keepSpace = true,
  }: {
    replacementChar?: string
    keepFirst?: number
    keepLast?: number
    keepSpace?: boolean
  } = {},
): string {
  return str
    .split('')
    .map((char, index, array) => {
      if (keepSpace && char === ' ') {
        return char
      }

      return index < keepFirst || index >= array.length - keepLast ? char : replacementChar
    })
    .join('')
}
