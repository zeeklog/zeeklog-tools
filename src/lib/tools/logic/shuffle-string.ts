/** Durstenfeld shuffle，与 online-tool-box/src/utils/random.ts 一致 */
function shuffleArrayMutate<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function shuffleString(str: string, delimiter = ''): string {
  return shuffleArrayMutate(str.split(delimiter)).join(delimiter)
}
