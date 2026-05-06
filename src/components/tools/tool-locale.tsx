'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'

const ToolLocaleContext = createContext<Locale>('en')

type ToolLocaleProviderProps = {
  locale: Locale
  children: ReactNode
}

export function ToolLocaleProvider({ locale, children }: ToolLocaleProviderProps) {
  return <ToolLocaleContext.Provider value={locale}>{children}</ToolLocaleContext.Provider>
}

export function useToolLocale(): Locale {
  return useContext(ToolLocaleContext)
}
