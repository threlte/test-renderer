import { getContext } from 'svelte'

/**
 * @typedef {{
 *   count?: number,
 *   delta?: number
 * }} AdvanceOptions
 */

/**
 * @typedef {{
 *   dispose: () => void,
 *   resetFrameInvalidation: () => void
 * }} InternalCtx
 */

/**
 *
 * @param context {import('@threlte/core').ThrelteContext}
 * @returns {undefined}
 */
export const mockAdvanceFn = (context) => {
	/** @type InternalCtx */
	const internalContext = getContext('threlte-internal-context')

	/**
	 *
	 * @param {AdvanceOptions} options
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
	}
}
