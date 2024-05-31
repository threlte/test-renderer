/**
 * Rendering core for svelte-testing-library.
 *
 * Defines how components are added to and removed from the DOM.
 * Will switch to legacy, class-based mounting logic
 * if it looks like we're in a Svelte <= 4 environment.
 */
import * as Svelte from 'svelte'

import { LegacyCore } from './core-legacy'

const IS_MODERN_SVELTE = 'mount' in Svelte && typeof Svelte.mount === 'function'

/**
 * Props signals for each rendered component.
 *
 * @type {Map<Svelte.SvelteComponent, Record<string, unknown>>}
 */
const propsByComponent = new Map()

const ModernCore = {
	/**
	 * Allowed options to the `mount` call.
	 *
	 * @type {string[]}
	 */
	componentOptions: ['target', 'anchor', 'props', 'events', 'context', 'intro'],

	/**
	 * Mount the component into the DOM.
	 *
	 * @param {Svelte.SvelteComponent} ComponentConstructor
	 * @param {Svelte.ComponentConstructorOptions} componentOptions
	 * @returns {ReturnType<Svelte.mount>}
	 */
	renderComponent: (ComponentConstructor, componentOptions) => {
		const props = $state(componentOptions.props ?? {})
		const component = Svelte.mount(ComponentConstructor, {
			...componentOptions,
			props,
		})

		propsByComponent.set(component, props)

		return component
	},

	/**
	 * Update the component's props.
	 *
	 * Relies on the `$state` signal added in `renderComponent`.
	 *
	 * @param {Svelte.SvelteComponent} component
	 * @param {Record<string, unknown>} nextProps
	 */
	updateProps: (component, nextProps) => {
		const prevProps = propsByComponent.get(component)

		if (!prevProps) {
			throw new Error(`prevProps not found for ${component}`)
		}

		Object.assign(prevProps, nextProps)
	},

	/**
	 * Remove the component from the DOM.
	 *
	 * @param {Svelte.SvelteComponent} component
	 */
	cleanupComponent: (component) => {
		propsByComponent.delete(component)
		Svelte.unmount(component)
	},
}

export const Core = IS_MODERN_SVELTE ? ModernCore : LegacyCore
