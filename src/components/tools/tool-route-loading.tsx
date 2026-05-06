/** 工具懒加载占位（独立文件，避免与 dynamic-tool-views 的大表耦合） */
export function ToolRouteLoading() {
  return (
    <div
      className="rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-10 text-center text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      Loading tool…
    </div>
  )
}
