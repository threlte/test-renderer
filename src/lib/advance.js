/**
 * @typedef {{
 *   count?: number,
 *   delta?: number
 * }} AdvanceOptions
 */

import { useScheduler } from '@threlte/core'
import { flushSync } from 'svelte'

export const mockAdvanceFn = () => {
  const context = useScheduler()

  /**
   * @param {AdvanceOptions} options
   * @returns {{ frameInvalidated: boolean }}
   */
  const advance = (options = {}) => {
    const { count = 1, delta = 16 } = options

    let frameInvalidated = false

    for (let index = 0; index < count; index += 1) {
      // @ts-expect-error Set last time to get precise deltas
      context.scheduler.lastTime = 0
      // Run inside flushSync to drain reactive effects (renderer
      // setup effects call invalidate()). Reset afterward so
      // only user-initiated invalidations are visible.
      flushSync(() => context.scheduler.run(delta ?? 16))
      context.frameInvalidated.current = false
      frameInvalidated = context.shouldRender()
    }

    return { frameInvalidated }
  }

  return advance
}
