'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

function getIsAppleClient(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/Mac|iPhone|iPad|iPod/i.test(ua)) return true
  const p = navigator.platform
  if (p === 'MacIntel' || p === 'iPhone' || p === 'iPad') return true
  return false
}

function getServerSnapshot(): boolean {
  return false
}

/** 客户端水合后判断是否为 Apple 平台（用于只展示 ⌘ 或 Ctrl 文案） */
export function useIsApplePlatform(): boolean {
  return useSyncExternalStore(subscribe, getIsAppleClient, getServerSnapshot)
}
