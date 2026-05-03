export const MIN_ARABIC_TO_ROMAN = 1
export const MAX_ARABIC_TO_ROMAN = 3999

export function arabicToRoman(num: number): string {
  if (num < MIN_ARABIC_TO_ROMAN || num > MAX_ARABIC_TO_ROMAN) {
    return ''
  }

  const lookup: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  }
  let n = num
  let roman = ''
  for (const sym of Object.keys(lookup)) {
    const v = lookup[sym]!
    while (n >= v) {
      roman += sym
      n -= v
    }
  }
  return roman
}

const ROMAN_NUMBER_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/

export function isValidRomanNumber(romanNumber: string): boolean {
  return ROMAN_NUMBER_REGEX.test(romanNumber)
}

const MAP: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

export function romanToArabic(s: string): number | null {
  if (!isValidRomanNumber(s)) {
    return null
  }
  return [...s].reduce((r, c, i, arr) => (MAP[arr[i + 1]!]! > MAP[c]! ? r - MAP[c]! : r + MAP[c]!), 0)
}
