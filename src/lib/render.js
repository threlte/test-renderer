// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SvelteComponent, tick } from 'svelte'
import Container from './Container.svelte'

/**
 * @type {Set<SvelteComponent>}
 */
const componentCache = new Set()

/**
 * @type {Set<HTMLElement>}
 */
const targetCache = new Set()

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

/**
 *
 * @param {typeof SvelteComponent} Component
 * @param {{ target?: HTMLElement } & Record<string, unknown>} componentOptions
 * @param {{ baseElement?: HTMLElement, canvas?: HTMLCanvasElement, userSize?: { width: number; height: number }}} renderOptions
 * @returns
 */
export const render = (Component, componentOptions = {}, renderOptions = {}) => {
	const { userSize, canvas = document.createElement('canvas') } = renderOptions

	const baseElement = renderOptions.baseElement ?? componentOptions.target ?? document.body
	const target = componentOptions.target ?? baseElement.appendChild(document.createElement('div'))

	const component = new Container({
		target,
		props: {
			canvas,
			component: Component,
			userSize,
			...componentOptions
		}
	})

	targetCache.add(target)
	componentCache.add(component)

	/**
	 * @TODO(mp): Try to generate contexts here and pass it into the component in Svelte 5 version.
	 * Cannot do in v4 due to `get_current_component()`.
	 * @type {import('@threlte/core').ThrelteContext}
	 */
	const threlteContext = component.$$.context.get('threlte')
	const dispatcherContext = [...component.$$.context.values()].find((ctx) => ctx.dispatchers)

	return {
		baseElement,
		component: component.ref,
		scene: threlteContext.scene,
		camera: threlteContext.camera,
		context: threlteContext,
		advance: threlteContext.advance,

		/**
		 *
		 * @param {import('three').Object3D} object3D
		 * @param {ThrelteEvents} event
		 * @param {import('@threlte/extras').IntersectionEvent<ThrelteEvents>=} payload
		 */
		fireEvent: async (object3D, event, payload) => {
			const eventDispatcher = dispatcherContext.dispatchers.get(object3D)
			eventDispatcher(event, payload)
			await tick()
		},

		/**
		 *
		 * @param {Partial<{ component: typeof SvelteComponent }>} props
		 */
		rerender: async (props) => {
			component.$set(props)
			await tick()
		},

		unmount: () => {
			if (componentCache.has(component)) {
				componentCache.delete(component)
				component.$destroy()
			}
		}
	}
}

export const cleanup = () => {
	for (const component of componentCache) {
		component.$destroy()
	}
	componentCache.clear()

	for (const target of targetCache) {
		if (target.parentNode === document.body) {
			target.remove()
		}
	}
	targetCache.clear()
}

/**
 *
 * @param {() => Promise<unknown>=} fn
 * @returns {Promise<void>}
 */
export const act = async (fn) => {
	if (fn) {
		await fn()
	}
	return tick()
}
