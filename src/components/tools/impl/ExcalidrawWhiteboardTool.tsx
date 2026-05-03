'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import '@excalidraw/excalidraw/index.css'

const Excalidraw = dynamic(async () => (await import('@excalidraw/excalidraw')).Excalidraw, {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">正在加载 Excalidraw 编辑器...</p>,
})

export function ExcalidrawWhiteboardTool() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === boardRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  async function toggleFullscreen() {
    const target = boardRef.current
    if (!target) return
    if (document.fullscreenElement === target) {
      await document.exitFullscreen()
      return
    }
    await target.requestFullscreen()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          {isFullscreen ? '退出全屏白板' : '全屏白板'}
        </button>
      </div>

      <div ref={boardRef} className="overflow-hidden rounded-lg border bg-white">
        <div className="h-[78vh] min-h-[620px] w-full">
          <Excalidraw />
        </div>
      </div>
    </div>
  )
}
