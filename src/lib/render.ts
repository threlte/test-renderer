import { SvelteComponent, tick } from 'svelte'
import Container from './Container.svelte'
import type { ThrelteContext } from '@threlte/core'
import type { IntersectionEvent } from '@threlte/extras'
import type { Object3D } from 'three'

const componentCache = new Set<SvelteComponent>()
const targetCache = new Set<HTMLElement>()

// @TODO export this from @threlte/extras
export type ThrelteEvents =
	| 'click'
	| 'contextmenu'
	| 'dblclick'
	| 'wheel'
	| 'pointerup'
	| 'pointerdown'
	| 'pointerover'
	| 'pointerout'
	| 'pointerenter'
	| 'pointerleave'
	| 'pointermove'
	| 'pointermissed'

export const render = (
	Component: typeof SvelteComponent,
	componentOptions: {
		target?: HTMLElement
	} & Record<string, unknown> = {},
	renderOptions: {
		baseElement?: HTMLElement
		canvas?: HTMLCanvasElement
		userSize?: { width: number; height: number }
	} = {}
) => {
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
	 */
	const threlteContext = component.$$.context.get('threlte') as ThrelteContext
	const dispatcherContext = [...component.$$.context.values()].find((ctx) => ctx.dispatchers)

	return {
		baseElement,
		component: component.ref,
		scene: threlteContext.scene,
		camera: threlteContext.camera,
		context: threlteContext,
		advance: threlteContext.advance,
		fireEvent: async (
			object3D: Object3D,
			event: keyof ThrelteEvents,
			payload?: IntersectionEvent<typeof event>
		) => {
			const eventDispatcher = dispatcherContext.dispatchers.get(object3D)
			eventDispatcher(event, payload)
			await tick()
		},
		rerender: async (props: Partial<{ component: typeof SvelteComponent }>) => {
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

export const act = async (fn?: () => Promise<unknown>) => {
	if (fn) {
		await fn()
	}
	return tick()
}
