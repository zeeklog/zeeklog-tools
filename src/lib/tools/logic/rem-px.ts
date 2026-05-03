export function remToPx(rem: number, rootPx: number): number {
  if (!Number.isFinite(rem) || !Number.isFinite(rootPx) || rootPx <= 0) {
    return NaN
  }
  return rem * rootPx
}

export function pxToRem(px: number, rootPx: number): number {
  if (!Number.isFinite(px) || !Number.isFinite(rootPx) || rootPx <= 0) {
    return NaN
  }
  return px / rootPx
}

/** em 相对当前元素字号；此处与 rem 共用「根字号」仅作近似换算说明用 */
export function emToPx(em: number, contextPx: number): number {
  if (!Number.isFinite(em) || !Number.isFinite(contextPx) || contextPx <= 0) {
    return NaN
  }
  return em * contextPx
}

export function pxToEm(px: number, contextPx: number): number {
  if (!Number.isFinite(px) || !Number.isFinite(contextPx) || contextPx <= 0) {
    return NaN
  }
  return px / contextPx
}
