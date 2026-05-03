import { randIntFromInterval } from './random'

/** 与 online-tool-box/src/tools/random-port-generator/random-port-generator.model.ts 一致 */
export function generatePort(): number {
  return randIntFromInterval(1024, 65535)
}
