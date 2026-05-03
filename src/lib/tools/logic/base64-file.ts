import { extension as getExtensionFromMime } from 'mime-types'

const COMMON_MIME_SIGNATURES: Record<string, string> = {
  JVBERi0: 'application/pdf',
  R0lGODdh: 'image/gif',
  R0lGODlh: 'image/gif',
  iVBORw0KGgo: 'image/png',
  '/9j/': 'image/jpg',
}

export function getMimeTypeFromBase64(base64String: string): { mimeType: string | undefined } {
  const match = base64String.match(/data:(.*?);base64/i)
  const mimeTypeFromBase64 = match?.[1]

  if (mimeTypeFromBase64) {
    return { mimeType: mimeTypeFromBase64 }
  }

  for (const [signature, mimeType] of Object.entries(COMMON_MIME_SIGNATURES)) {
    if (base64String.startsWith(signature)) {
      return { mimeType }
    }
  }

  return { mimeType: undefined }
}

export function getFileExtensionFromMimeType({
  mimeType,
  defaultExtension = 'txt',
}: {
  mimeType: string | undefined
  defaultExtension?: string
}): string {
  if (mimeType) {
    return getExtensionFromMime(mimeType) ?? defaultExtension
  }

  return defaultExtension
}

/** 浏览器内触发下载；需在客户端调用 */
export function downloadFileFromBase64(base64Input: string, filename?: string): void {
  if (base64Input.trim() === '') {
    throw new Error('Base64 string is empty')
  }

  const { mimeType } = getMimeTypeFromBase64(base64Input)
  const base64String = mimeType ? base64Input : `data:text/plain;base64,${base64Input}`
  const cleanFileName = filename ?? `file.${getFileExtensionFromMimeType({ mimeType })}`

  const a = document.createElement('a')
  a.href = base64String
  a.download = cleanFileName
  a.click()
}
