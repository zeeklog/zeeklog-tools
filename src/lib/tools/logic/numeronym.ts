/** 与 online-tool-box/src/tools/numeronym-generator/numeronym-generator.service.ts 一致 */
export function generateNumeronym(word: string): string {
  const wordLength = word.length

  if (wordLength <= 3) {
    return word
  }

  const first = word.at(0)
  const last = word.at(-1)
  if (first === undefined || last === undefined) {
    return word
  }

  return `${first}${wordLength - 2}${last}`
}
