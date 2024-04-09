import { getContext } from 'svelte'
import type { ThrelteContext } from '@threlte/core'

interface InternalCtx {
	dispose(): void
	resetFrameInvalidation(): void
}

export interface AdvanceOptions {
	count?: number
	delta?: number
}

export const mockAdvanceFn = (context: ThrelteContext) => {
	const internalContext = getContext<InternalCtx>('threlte-internal-context')

	context.advance = (options: AdvanceOptions = {}) => {
		internalContext.dispose()

		for (let i = 0, c = options.count ?? 1; i < c; i += 1) {
			// @TODO(mp) Expose lastTime (marked private)?
			// Allow more control over deltas in the run() call?
			// @ts-expect-error
			context.scheduler.lastTime = 0
			context.scheduler.run(options.delta ?? 16)
		}

		internalContext.resetFrameInvalidation()
	}
}
