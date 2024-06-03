/**
 * Legacy rendering core for svelte-testing-library.
 *
 * Supports Svelte <= 4. See `core.svelte.js` for more details.
 */

export const LegacyCore = {
	/**
	 * Allowed options for the component constructor.
	 * @type {string[]}
	 */
	componentOptions: ['target', 'accessors', 'anchor', 'props', 'hydrate', 'intro', 'context'],

	/**
	 * Mount the component into the DOM.
	 *
	 * The `onDestroy` callback is included for strict backwards compatibility
	 * with previous versions of this library. It's mostly unnecessary logic.
	 *
	 * @param {typeof import('svelte').SvelteComponent} ComponentConstructor
	 * @param {import('svelte').ComponentConstructorOptions} componentOptions
	 * @param {*} onDestroy
	 * @returns {import('svelte').SvelteComponent}
	 */
	renderComponent: (ComponentConstructor, componentOptions, onDestroy) => {
		const component = new ComponentConstructor(componentOptions)

		component.$$.on_destroy.push(() => {
			onDestroy(component)
		})

		return component
	},

	/**
	 * Update the component's props.
	 *
	 * @param {import('svelte').SvelteComponent} component
	 * @param {*} nextProps
	 */
	updateProps: (component, nextProps) => {
		component.$set(nextProps)
	},

	/**
	 * Remove the component from the DOM.
	 *
	 * @param {import('svelte').SvelteComponent} component
	 */
	cleanupComponent: (component) => {
		component.$destroy()
	},
}
