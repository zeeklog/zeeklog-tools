import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case'

const wordSplit = (value: string) => value.split(/[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi).filter(Boolean)

const opts = { split: wordSplit } as const

export function buildCaseFormats(input: string): { label: string; value: string }[] {
  return [
    { label: 'Lowercase:', value: input.toLocaleLowerCase() },
    { label: 'Uppercase:', value: input.toLocaleUpperCase() },
    { label: 'Camelcase:', value: camelCase(input, opts) },
    { label: 'Capitalcase:', value: capitalCase(input, opts) },
    { label: 'Constantcase:', value: constantCase(input, opts) },
    { label: 'Dotcase:', value: dotCase(input, opts) },
    { label: 'Headercase:', value: trainCase(input, opts) },
    { label: 'Nocase:', value: noCase(input, opts) },
    { label: 'Paramcase:', value: kebabCase(input, opts) },
    { label: 'Pascalcase:', value: pascalCase(input, opts) },
    { label: 'Pathcase:', value: pathCase(input, opts) },
    { label: 'Sentencecase:', value: sentenceCase(input, opts) },
    { label: 'Snakecase:', value: snakeCase(input, opts) },
    {
      label: 'Mockingcase:',
      value: input
        .split('')
        .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
        .join(''),
    },
  ]
}
