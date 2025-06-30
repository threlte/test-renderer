/**
 * @typedef {{
 *   count?: number,
 *   delta?: number
 * }} AdvanceOptions
 */

import { useScheduler } from '@threlte/core'

/**
 *
 * @param context {import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>}
 */
export const mockAdvanceFn = () => {
  const context = useScheduler()

  /**
   *
   * @param {AdvanceOptions} options
   */
  const advance = (options = {}) => {
    const { count = 1, delta = 16 } = options

    for (let index = 0; index < count; index += 1) {
      // @ts-ignore Set last time to get precise deltas
      context.scheduler.lastTime = 0
      context.scheduler.run(delta ?? 16)
    }
  }

  return advance
}
