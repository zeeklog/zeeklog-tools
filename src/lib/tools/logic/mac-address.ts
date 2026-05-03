export function splitMacPrefix(prefix: string): string[] {
  const base = prefix.match(/[^0-9a-f]/i) === null ? (prefix.match(/.{1,2}/g) ?? []) : prefix.split(/[^0-9a-f]/i)
  return base.filter(Boolean).map((byte) => byte.padStart(2, '0'))
}

export function generateRandomMacAddress({
  prefix: rawPrefix = '',
  separator = ':',
}: {
  prefix?: string
  separator?: string
} = {}): string {
  const prefix = splitMacPrefix(rawPrefix)
  const randomBytes: string[] = []
  for (let i = 0; i < 6 - prefix.length; i++) {
    randomBytes.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
  }
  const bytes = [...prefix, ...randomBytes]
  return bytes.join(separator)
}
