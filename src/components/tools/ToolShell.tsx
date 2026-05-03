import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ToolDefinition } from '@/lib/tools/types'
import { TOOL_CATEGORY_LABEL } from '@/lib/tools/types'
import { TOOL_CATEGORIES_ORDER, toolsInCategory } from '@/lib/tools/registry'
import type { ToolFaqItem } from '@/lib/tools/tool-page-content'
import { getToolStructuredDataGraph, getSiteBaseUrl } from '@/lib/tools/tool-page-seo'
import { serializeJsonLdForScript } from '@/lib/seo-utils'

type ToolShellProps = {
  tool: ToolDefinition
  /** 80–150 字 meta 摘要，与 `<meta name="description">` 一致 */
  metaDescription: string
  /** 约 200–300 字的页面独特介绍（独立段落） */
  longIntro: string
  faq: ToolFaqItem[]
  featureKeywords: string[]
  currentSlug?: string
  children: ReactNode
}

export function ToolShell({
  tool,
  metaDescription,
  longIntro,
  faq,
  featureKeywords,
  currentSlug,
  children,
}: ToolShellProps) {
  const categoryLabel = TOOL_CATEGORY_LABEL[tool.category]
  const site = getSiteBaseUrl()
  const pageUrl = `${site}/tools/${tool.slug}`
  const structured = getToolStructuredDataGraph({
    tool,
    metaDescription,
    schemaDescription: longIntro,
    pageUrl,
    faq,
  })

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdForScript(structured) }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 max-w-4xl rounded-full bg-gradient-to-b from-orange-200/25 via-amber-100/15 to-transparent blur-3xl"
        aria-hidden
      />
      <nav aria-label="工具页导航">
        <Link
          href="/"
          className="relative mb-6 inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50 hover:text-orange-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          返回首页
        </Link>
      </nav>

      <div className="relative flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{tool.title}</h1>
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-900">
          {categoryLabel}
        </span>
      </div>
      <p className="relative mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{metaDescription}</p>

      <div className="mt-8 grid grid-cols-1 gap-8">
        <div>
          <section
            className="relative"
            itemScope
            itemType="https://schema.org/SoftwareApplication"
            aria-labelledby="tool-use-heading"
          >
            <meta itemProp="name" content={tool.title} />
            <meta itemProp="description" content={metaDescription} />
            <meta itemProp="applicationCategory" content="DeveloperApplication" />
            <meta itemProp="operatingSystem" content="Any" />
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-12px_rgba(15,23,42,0.08)]">
              <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" aria-hidden />
              <div className="tool-ui p-4 sm:p-6 lg:p-8">{children}</div>
            </div>
          </section>

          <section className="relative mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-6" aria-labelledby="tool-features-heading">
            <h2 id="tool-features-heading" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              功能与特点
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
              {featureKeywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </section>

          <section
            className="relative mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6"
            aria-labelledby="tool-how-heading"
          >
            <h2 id="tool-how-heading" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              如何使用
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
              <li>在上方「在线使用」区域输入或粘贴待处理内容，或按界面提示上传文件。</li>
              <li>根据需要调整选项，点击对应按钮完成格式化、转换、计算或生成。</li>
              <li>在页面中直接查看结果；若工具提供，可复制或下载输出内容。</li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              本工具在浏览器中运行，处理逻辑尽量在本地完成；涉及敏感数据时，请结合业务安全要求评估后使用。
            </p>
          </section>

          <section
            className="relative mt-8 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-6"
            aria-labelledby="tool-faq-heading"
          >
            <h2 id="tool-faq-heading" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              常见问题
            </h2>
            <dl className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-slate-900">{item.question}</dt>
                  <dd className="mt-1.5 text-slate-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <aside
        className="relative mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-6"
        aria-labelledby="tool-related-heading"
      >
        <h2 id="tool-related-heading" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          推荐与相关工具
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          按分类继续浏览站内其他工具。
        </p>
        <div className="mt-6 space-y-8">
          {TOOL_CATEGORIES_ORDER.map((category) => {
            const list = toolsInCategory(category)
            if (!list.length) return null
            return (
              <div key={category}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-800/90">
                  {TOOL_CATEGORY_LABEL[category]}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {list.map((t) => {
                    const isCurrent = currentSlug === t.slug
                    return (
                      <li key={t.slug}>
                        {isCurrent ? (
                          <span
                            className="inline-flex rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-950"
                            aria-current="page"
                          >
                            {t.title}
                          </span>
                        ) : (
                          <Link
                            href={`/tools/${t.slug}`}
                            prefetch={false}
                            className="inline-flex rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-800 transition hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-950"
                          >
                            {t.title}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </aside>

      <section
        className="relative mt-10 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6"
        aria-labelledby="tool-about-heading"
      >
        <h2 id="tool-about-heading" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          关于本工具
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">{longIntro}</p>
      </section>
    </div>
  )
}
