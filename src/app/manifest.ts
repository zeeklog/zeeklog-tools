import type { MetadataRoute } from 'next'
import { SITE_DOMAIN, SITE_NAME } from '@/config/site-brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME.en,
    short_name: SITE_NAME.en,
    description: `${SITE_DOMAIN} online toolkit for format conversion, encoding, text processing, and developer workflows.`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
