/** 与 online-tool-box/src/utils/random.ts 一致（含 randInt 上界为开区间的语义） */
export function randFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

export function randIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}
