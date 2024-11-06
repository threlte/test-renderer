if (typeof window !== 'undefined') {
	const { warn: originalWarn } = console

	/**
	 * @TODO Is this an issue on our end / cleanup / or JSDOM?
	 * @param  {...unknown} args
	 */
	const warn = (...args) => {
		if (args[0] === 'WARNING: Multiple instances of Three.js being imported.') {
			return
		}

		originalWarn.call(console, ...args)
	}

	// eslint-disable-next-line no-console
	console.warn = warn
}

export { act, render } from './pure'
export { cleanup } from '@testing-library/svelte/core'
