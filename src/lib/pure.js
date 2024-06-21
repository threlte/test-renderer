import * as Svelte from 'svelte'
import Container from './Container.svelte'
import { Core } from './core.svelte.js'

/**
 * Check if a value is a plain object.
 *
 * @param {unknown} maybeObj
 * @returns {maybeObj is Record<string, unknown>}
 */
const isObject = (maybeObj) => {
	return typeof maybeObj === 'object' && maybeObj !== null && !Array.isArray(maybeObj)
}

/** @type {Set<HTMLElement>} */
const targetCache = new Set()

/** @type {Set<Svelte.SvelteComponent>} */
const componentCache = new Set()

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

/**
 *
 * @param {Record<string, unknown>} options
 * @returns {Record<string, unknown> & { target?: HTMLElement, props?: Record<string, unknown> }}
 */
const checkProps = (options) => {
	if (!isObject(options)) {
		throw new TypeError('Render options must be a plain object')
	}

	const keys = Object.keys(options)
	const isProps = !keys.some((option) => {
		return Core.componentOptions.includes(option)
	})

	// Check if any props and Svelte options were accidentally mixed.
	if (!isProps) {
		const unrecognizedOptions = keys.filter((option) => {
			return !Core.componentOptions.includes(option)
		})

		if (unrecognizedOptions.length > 0) {
			throw new TypeError(`
          Unknown options were found [${unrecognizedOptions}]. This might happen if you've mixed
          passing in props with Svelte options into the render function. Valid Svelte options
          are [${Core.componentOptions}]. You can either change the prop names, or pass in your
          props for that component via the \`props\` option.\n\n
          Eg: const { /** Results **/ } = render(MyComponent, { props: { /** props here **/ } })\n\n
        `)
		}

		if (options.props && !isObject(options.props)) {
			throw new TypeError('`props` option must be a plain object')
		}

		return options
	}

	return { props: options }
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
	const checkedOptions = checkProps(componentOptions)

	/** @type {HTMLElement} */
	const baseElement = renderOptions.baseElement ?? checkedOptions.target ?? document.body

	/** @type {HTMLElement} */
	const target = checkedOptions.target ?? baseElement.appendChild(document.createElement('div'))
	targetCache.add(target)

	/** @type {HTMLCanvasElement} */
	const canvas = renderOptions.canvas ?? document.createElement('canvas')

	/** @type {any} */
	const ComponentConstructor = 'default' in Component ? Component.default : Component

	/** @type {any} */
	const anyContainer = Container

	/** @type {Record<string, unknown> | undefined} */
	let componentProps = checkedOptions.props

	const component = Core.renderComponent(
		anyContainer,
		{
			...checkedOptions,
			props: {
				canvas,
				component: ComponentConstructor,
				componentProps,
				userSize: renderOptions.userSize,
			},
			target,
		},
		cleanupComponent
	)

	componentCache.add(component)

	/**
	 * @type {import('@threlte/core').ThrelteContext}
	 */
	const context = component.threlteContext

	/**
	 * @type {{
	 *   dispose: () => void,
	 *   frameInvalidated: boolean,
	 *   resetFrameInvalidation: () => void
	 * }}
	 */
	const internalCtx = component.internalContext

	const handlerCtx = component.$$
		? [...component.$$.context.values()].find((ctx) => {
				return ctx.dispatchers || ctx.handlers
			})
		: component.interactivityContext

	const handlers = handlerCtx.dispatchers || handlerCtx.handlers

	return {
		baseElement,
		camera: context.camera,
		component: component.ref,
		container: target,
		context,
		frameInvalidated: internalCtx.frameInvalidated,
		scene: context.scene,

		advance: context.advance,

		/**
		 *
		 * @param {import('three').Object3D} object3D
		 * @param {ThrelteEvents} event
		 * @param {import('@threlte/extras').IntersectionEvent<ThrelteEvents>=} payload
		 */
		fireEvent: async (object3D, event, payload) => {
			const eventDispatcher = handlers.get(object3D)
			if (typeof eventDispatcher === 'function') {
				eventDispatcher(event, payload)
			} else {
				eventDispatcher[event](payload)
			}

			await Svelte.tick()
		},

		/**
		 *
		 * @param {Record<string, unknown>} props
		 */
		rerender: async (props) => {
			componentProps = { ...componentProps, ...props }
			Core.updateProps(component, { componentProps })
			await Svelte.tick()
		},

		unmount: () => {
			cleanupComponent(component)
		},
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
