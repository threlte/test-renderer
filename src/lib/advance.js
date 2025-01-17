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
 * @param context {import('@threlte/core').ThrelteContext}
 * @param internalContext {InternalCtx | undefined}
 * @returns {undefined}
 */
export const mockAdvanceFn = (context, internalContext) => {
	/**
	 * Threlte 7
	 */
	if (internalContext) {
		/**
		 *
		 * @param {AdvanceOptions} options
		 * @returns {{ frameInvalidated: boolean }}
		 */
		context.advance = (options = {}) => {
			internalContext.dispose()

			const count = options.count ?? 1
			for (let index = 0; index < count; index += 1) {
				// @ts-expect-error @TODO(mp) Expose lastTime (marked private)? Allow more control over deltas in the run() call?
				context.scheduler.lastTime = 0
				context.scheduler.run(options.delta ?? 16)
			}

			internalContext.resetFrameInvalidation()

			return {
				frameInvalidated: internalContext.frameInvalidated,
			}
		}
		/**
		 * Threlte 8
		 */
	} else {
		/**
		 *
		 * @param {AdvanceOptions} options
		 * @returns {{ frameInvalidated: boolean }}
		 */
		context.advance = (options = {}) => {
			// @ts-expect-error Remove once we only support Threlte 8
			context.dispose()

			const count = options.count ?? 1
			for (let index = 0; index < count; index += 1) {
				// @ts-expect-error @TODO(mp) Expose lastTime (marked private)? Allow more control over deltas in the run() call?
				context.scheduler.lastTime = 0
				context.scheduler.run(options.delta ?? 16)
			}

			// @ts-expect-error Remove once we only support Threlte 8
			context.resetFrameInvalidation()

			return {
				// @ts-expect-error Remove once we only support Threlte 8
				frameInvalidated: context.frameInvalidated,
			}
		}
	}
}
