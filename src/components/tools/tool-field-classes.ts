/** 工具页内统一输入/输出样式（与 ToolShell 内卡片协调） */

export const toolSectionClass = 'space-y-4'

export const toolSectionTitleClass = 'text-base font-semibold tracking-tight text-slate-900'

export const toolLabelClass = 'block text-sm font-medium text-slate-800'

/** 可编辑多行 */
export const toolTextareaInClass =
  'mt-1.5 w-full min-h-[7rem] resize-y rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 font-mono text-sm leading-relaxed text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100'

/** 只读结果 */
export const toolTextareaOutClass =
  'mt-1.5 w-full min-h-[7rem] resize-y rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2.5 font-mono text-sm leading-relaxed text-slate-900'

/** 单行可编辑 */
export const toolInputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100'

/** 只读单行 */
export const toolInputReadonlyClass =
  'mt-1.5 w-full rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2.5 font-mono text-sm text-slate-900'

/** CodeMirror（GitHub Dark）：可编辑代码区外层，与站内卡片对齐；编辑区内由主题着色 */
export const toolCodeMirrorWrapInClass =
  'mt-1.5 overflow-hidden rounded-xl border border-slate-200/90 shadow-sm [&_.cm-editor.cm-focused]:outline-none [&_.cm-focused]:ring-2 [&_.cm-focused]:ring-orange-100'

/** CodeMirror：只读输出区外层 */
export const toolCodeMirrorWrapOutClass =
  'mt-1.5 overflow-hidden rounded-xl border border-slate-100 shadow-sm [&_.cm-editor.cm-focused]:outline-none [&_.cm-focused]:ring-2 [&_.cm-focused]:ring-orange-100'

/**
 * 代码转换器「输入 | 输出」双栏：默认竖向堆叠，lg 及以上左右并排。
 * 直接子节点多为 `<label>`（内含 `ToolCodeMirror`），子项 `min-w-0` 防止格子撑破布局。
 */
export const toolConverterEditorGridClass =
  'grid grid-cols-1 gap-4 *:min-w-0 lg:grid-cols-2 lg:gap-6 lg:items-stretch [&>label]:flex [&>label]:min-h-0 [&>label]:flex-col [&>label]:gap-1.5'
