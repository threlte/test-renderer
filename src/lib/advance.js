/**
 * @typedef {{
 *   count?: number,
 *   delta?: number
 * }} AdvanceOptions
 */

/**
 * @typedef {{
 *   dispose: () => void,
 *   frameInvalidated: boolean,
 *   resetFrameInvalidation: () => void
 * }} InternalCtx
 */

/**
 *
 * @param context {import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>}
 */
export const mockAdvanceFn = (context) => {
  /**
   *
   * @param {AdvanceOptions} options
   */
  const advance = (options = {}) => {
    const count = options.count ?? 1

    for (let index = 0; index < count; index += 1) {
      // @ts-expect-error @TODO(mp) Expose lastTime (marked private)? Allow more control over deltas in the run() call?
      context.scheduler.lastTime = 0
      context.scheduler.run(options.delta ?? 16)
    }
  }

  context.advance = advance

  return advance
}
