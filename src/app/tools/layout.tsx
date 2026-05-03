import type { ReactNode } from 'react'
import type { Viewport } from 'next'

/** 根布局已设置 metadataBase（siteOrigin）；此处不再导出子布局 metadata，避免与子页面 title/description 合并边界问题。 */

/** 移动端 CWV：显式作用于 /tools/*，与根布局一致 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f97316',
}

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-white">{children}</div>
}
