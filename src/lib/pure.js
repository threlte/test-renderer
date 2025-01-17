import * as Svelte from 'svelte'
import { mount, prepareDocument } from '@testing-library/svelte/core'
import Container from './Container.svelte'

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

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
	const { baseElement, target, options } = prepareDocument(componentOptions, renderOptions)

	/** @type {HTMLCanvasElement} */
	const canvas = renderOptions.canvas ?? document.createElement('canvas')
	target.append(canvas)

	/** @type {any} */
	const ComponentConstructor = 'default' in Component ? Component.default : Component

	/** @type {Record<string, unknown> | undefined} */
	let componentProps = options.props

	const { component, unmount, rerender } = mount(Container, {
		...options,
		props: {
			canvas,
			component: ComponentConstructor,
			componentProps,
			userSize: renderOptions.userSize,
		},
	})

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
			await rerender({ componentProps })
		},

		unmount,
	}
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
