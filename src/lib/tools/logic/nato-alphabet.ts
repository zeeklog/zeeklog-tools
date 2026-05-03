export const NATO_ALPHABET = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'X-ray',
  'Yankee',
  'Zulu',
] as const

function letterIndex(letter: string): number {
  return letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
}

export function textToNatoAlphabet(text: string): string {
  return text
    .split('')
    .map((character) => {
      const idx = letterIndex(character)
      const natoWord = NATO_ALPHABET[idx]
      return natoWord ?? character
    })
    .join(' ')
}
