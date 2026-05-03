/** @type {import('next').NextConfig} */
const nextConfig = {
  /** 默认即为 false；显式声明，避免误开 productionBrowserSourceMaps 时向浏览器暴露源码映射 */
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  transpilePackages: ['pdfjs-dist'],
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  serverExternalPackages: ['sharp'],
  async redirects() {
    return [
      { source: '/tools/hash', destination: '/tools/hash-text', permanent: true },
      { source: '/tools/cypher', destination: '/tools/encryption', permanent: true },
      { source: '/tools/json-viewer', destination: '/tools/json-prettify', permanent: true },
      { source: '/tools/file-to-base64', destination: '/tools/base64-string-converter', permanent: true },
      { source: '/tools/base64-converter', destination: '/tools/base64-string-converter', permanent: true },
      { source: '/tools/color-picker-converter', destination: '/tools/color-converter', permanent: true },
      { source: '/tools/text-stats', destination: '/tools/text-statistics', permanent: true },
    ]
  },
  images: {
    // 直接输出原始图片 URL，避免走 /_next/image 服务端中转
    unoptimized: true,
  },
  // 压缩配置
  compress: true,
  // 禁用构建阶段的 TypeScript 检查（仅类型，不影响运行时）
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
