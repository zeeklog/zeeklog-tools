import { shuffleString } from './shuffle-string'

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  length?: number
  alphabet?: string
}): string {
  const allAlphabet =
    alphabet ??
    [
      withUppercase ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : '',
      withLowercase ? 'abcdefghijklmopqrstuvwxyz' : '',
      withNumbers ? '0123456789' : '',
      withSymbols ? `.,;:!?./-"'#([-|\\@)]=}*+` : '',
    ].join('')

  if (allAlphabet.length === 0) {
    return ''
  }

  return shuffleString(allAlphabet.repeat(length)).substring(0, length)
}
