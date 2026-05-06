'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** 用于日志与无障碍说明 */
  sectionLabel?: string
  className?: string
}

type State = { error: Error | null }

function getLocale(): 'en' | 'zh' {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'
}

/**
 * 局部错误边界：渲染期异常只影响包裹区域，不冒泡到路由级 error.tsx。
 */
export class UiErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UiErrorBoundary]', this.props.sectionLabel ?? 'section', error, info.componentStack)
  }

  private handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    const { children, sectionLabel, className } = this.props
    if (this.state.error) {
      const locale = getLocale()
      const ariaLabel = sectionLabel
        ? locale === 'zh'
          ? `${sectionLabel} 加载失败`
          : `${sectionLabel} failed to load`
        : locale === 'zh'
          ? '内容加载失败'
          : 'Content failed to load'
      return (
        <div
          role="alert"
          aria-label={ariaLabel}
          className={
            className ??
            'rounded-xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 text-center shadow-sm'
          }
        >
          <p className="text-sm font-medium text-amber-950">
            {locale === 'zh'
              ? `${sectionLabel ? `「${sectionLabel}」` : '该区块'}暂时无法显示`
              : `${sectionLabel ? `"${sectionLabel}"` : 'This section'} is temporarily unavailable`}
          </p>
          <p className="mt-1 text-xs text-amber-800/90">
            {locale === 'zh'
              ? '其他区域不受影响，请稍后重试或刷新页面。'
              : 'Other areas are unaffected. Please retry or refresh the page.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-3 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
          >
            {locale === 'zh' ? '重试' : 'Retry'}
          </button>
        </div>
      )
    }
    return children
  }
}
