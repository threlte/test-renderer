import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Add `browser` to `resolve.conditions` before `node`.
 *
 * This ensures that Svelte's browser code is used in tests,
 * rather than its SSR code.
 *
 * @param {import('vitest/config').UserConfig} config
 */
const addBrowserCondition = (config) => {
	const resolve = config.resolve ?? {}
	const conditions = resolve.conditions ?? []
	const nodeConditionIndex = conditions.indexOf('node')
	const browserConditionIndex = conditions.indexOf('browser')

	if (
		nodeConditionIndex >= 0 &&
		(nodeConditionIndex < browserConditionIndex || browserConditionIndex < 0)
	) {
		conditions.splice(nodeConditionIndex, 0, 'browser')
	}

	resolve.conditions = conditions
	config.resolve = resolve
}

/**
 * Add auto-cleanup file to Vitest's setup files.
 *
 * @param {import('vitest/config').UserConfig} config
 */
const addAutoCleanup = (config) => {
	const test = config.test ?? {}
	let setupFiles = test.setupFiles ?? []

	if (typeof setupFiles === 'string') {
		setupFiles = [setupFiles]
	}

	setupFiles.push(join(dirname(fileURLToPath(import.meta.url)), './vitest.js'))

	test.setupFiles = setupFiles
	config.test = test
}

/**
 * Vite plugin to configure @threlte/test.
 *
 * Ensures Svelte is imported correctly in tests
 * and that the DOM is cleaned up after each test.
 *
 * @param {{resolveBrowser?: boolean, autoCleanup?: boolean}} options
 * @returns {import('vite').Plugin}
 */
export const threlteTesting = ({ resolveBrowser = true, autoCleanup = true } = {}) => {
	return {
		name: 'vite-plugin-threlte-test-renderer',

		config: (config) => {
			if (!process.env.VITEST) {
				return
			}

			if (resolveBrowser) {
				addBrowserCondition(config)
			}

			if (autoCleanup) {
				addAutoCleanup(config)
			}
		},
	}
}
