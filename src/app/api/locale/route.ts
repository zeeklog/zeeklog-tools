import { NextResponse } from 'next/server'
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/lib/i18n'

function safeRedirectPath(input: string | null): string {
  if (!input) return '/'
  if (!input.startsWith('/')) return '/'
  if (input.startsWith('//')) return '/'
  return input
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = resolveLocale(url.searchParams.get('locale'))
  const redirect = safeRedirectPath(url.searchParams.get('redirect'))

  const response = NextResponse.redirect(new URL(redirect, url.origin))
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}
