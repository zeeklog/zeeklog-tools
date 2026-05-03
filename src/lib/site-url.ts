const DEFAULT_SITE_ORIGIN = 'http://127.0.0.1:3003'

function normalizeOrigin(raw?: string): string {
  if (!raw) return DEFAULT_SITE_ORIGIN

  try {
    return new URL(raw).origin
  } catch {
    return DEFAULT_SITE_ORIGIN
  }
}

/** 站点根 URL（无末尾斜杠），优先 SITE_URL */
export function siteOrigin(): string {
  return normalizeOrigin(process.env.SITE_URL).replace(/\/$/, '')
}
