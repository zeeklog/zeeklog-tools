import type { MetadataRoute } from 'next'
import { SITE_DOMAIN, SITE_NAME_ZH } from '@/config/site-brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME_ZH,
    short_name: SITE_NAME_ZH,
    description: `${SITE_DOMAIN} 在线工具箱，收录常用格式转换、编码解码、文本处理与开发辅助工具。`,
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
