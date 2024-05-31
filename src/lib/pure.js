import * as Svelte from 'svelte'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as THREE from 'three'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Threlte from '@threlte/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Extras from '@threlte/extras'

import { Core } from './core.svelte.js'
import Container from './Container.svelte'

/**
 *
 * @param {unknown} maybeObj
 * @returns {maybeObj is object}
 */
const isObject = (maybeObj) => {
	return typeof maybeObj === 'object' && maybeObj !== null
}

/**
 * @type {Set<HTMLElement>}
 */
const targetCache = new Set()

/**
 * @type {Set<Svelte.SvelteComponent>}
 */
const componentCache = new Set()

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

/**
 *
 * @param {Record<string, unknown>} options
 * @returns {Record<string, unknown>}
 */
const checkProps = (options) => {
	const keys = Object.keys(options)
	const isProps = !keys.some((option) => Core.componentOptions.includes(option))

	// Check if any props and Svelte options were accidentally mixed.
	if (!isProps) {
		const unrecognizedOptions = keys.filter((option) => !Core.componentOptions.includes(option))

		if (unrecognizedOptions.length > 0) {
			throw Error(`
          Unknown options were found [${unrecognizedOptions}]. This might happen if you've mixed
          passing in props with Svelte options into the render function. Valid Svelte options
          are [${Core.componentOptions}]. You can either change the prop names, or pass in your
          props for that component via the \`props\` option.\n\n
          Eg: const { /** Results **/ } = render(MyComponent, { props: { /** props here **/ } })\n\n
        `)
		}

		return options
	}

	return { props: options }
}

/**
 *
 * @param {typeof Svelte.SvelteComponent<any, any, any>} Component
 * @param {{
 *   target?: HTMLElement
 * } & Record<string, unknown>} componentOptions
 * @param {{
 *   baseElement?: HTMLElement
 *   canvas?: HTMLCanvasElement
 *   userSize?: { width: number; height: number }
 * }} renderOptions
 * @returns
 */
export const render = (Component, componentOptions = {}, renderOptions = {}) => {
	componentOptions = checkProps(componentOptions)

	const baseElement = renderOptions.baseElement ?? componentOptions.target ?? document.body

	const target = componentOptions.target ?? baseElement.appendChild(document.createElement('div'))

	targetCache.add(target)

	/** @type {any} */
	const ComponentConstructor = 'default' in Component ? Component.default : Component

	/** @type {any} */
	const anyContainer = Container

	const component = Core.renderComponent(
		anyContainer,
		{
			...componentOptions,
			props: {
				...(isObject(componentOptions.props) ? componentOptions.props : {}),
				canvas: renderOptions.canvas ?? document.createElement('canvas'),
				component: ComponentConstructor,
				userSize: renderOptions.userSize
			},
			target
		},
		cleanupComponent
	)

	componentCache.add(component)

	/**
	 * @TODO(mp): Provide the context to the new Component call rather than pulling it out of the component.
	 * Can be done when Svelte 4 support is dropped.
	 *
	 * @type {Threlte.ThrelteContext}
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
		container: target,

		/**
		 *
		 * @param {THREE.Object3D} object3D
		 * @param {ThrelteEvents} event
		 * @param {Extras.IntersectionEvent<ThrelteEvents>=} payload
		 */
		fireEvent: async (object3D, event, payload) => {
			const eventDispatcher = dispatcherContext.dispatchers.get(object3D)
			eventDispatcher(event, payload)
			await Svelte.tick()
		},

		/**
		 *
		 * @param {Record<string, unknown>} props
		 */
		rerender: async (props) => {
			Core.updateProps(component, props)
			await Svelte.tick()
		},

		unmount: () => {
			cleanupComponent(component)
		}
	}
}

/**
 *
 * @param {Svelte.SvelteComponent<any, any, any>} component
 */
const cleanupComponent = (component) => {
	const inCache = componentCache.delete(component)

	if (inCache) {
		Core.cleanupComponent(component)
	}
}

/**
 *
 * @param {HTMLElement} target
 */
const cleanupTarget = (target) => {
	const inCache = targetCache.delete(target)

	if (inCache && target.parentNode === document.body) {
		document.body.removeChild(target)
	}
}

export const cleanup = () => {
	componentCache.forEach(cleanupComponent)
	targetCache.forEach(cleanupTarget)
}

/**
 *
 * @param {((() => Promise<void>) | (() => void))=} fn
 * @returns {Promise<void>}
 */
export const act = async (fn) => {
	if (fn) {
		await fn()
	}
	return Svelte.tick()
}
