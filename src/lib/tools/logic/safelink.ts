export function decodeSafeLinksURL(safeLinksUrl: string): string {
  if (!safeLinksUrl.match(/\.safelinks\.protection\.outlook\.com/)) {
    throw new Error('Invalid SafeLinks URL provided')
  }

  const decoded = new URL(safeLinksUrl).searchParams.get('url')
  if (decoded === null) {
    throw new Error('Missing url query parameter')
  }
  return decoded
}
