import type { MetadataRoute } from 'next'
import { siteOrigin } from '@/lib/site-url'

function siteUrl(): string {
  return siteOrigin()
}

export default function robots(): MetadataRoute.Robots {
  const root = siteUrl()
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Baiduspider', allow: '/' },
      { userAgent: '360Spider', allow: '/' },
      { userAgent: 'Sogou web spider', allow: '/' },
    ],
    host: root.replace(/^https?:\/\//, ''),
  }
}
