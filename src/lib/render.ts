import { SvelteComponent, tick } from 'svelte'
import Container from './Container.svelte'
import type { ThrelteContext } from '@threlte/core'
import type { DomEvent, IntersectionEvent } from '@threlte/extras'
import type { Object3D } from 'three'

const containerCache = new Set()
const componentCache = new Set()

export const render = (
	Component: typeof SvelteComponent,
	{ ...options } = {},
	{ container, queries } = {}
) => {
	const component = new Container({
		target: document.body,
		props: {
			component: Component,
			...options
		}
	})

	containerCache.add({ container, component })
	componentCache.add(component)

	component.$$.on_destroy.push(() => {
		componentCache.delete(component)
	})

	const threlteContext = component.$$.context.get('threlte') as ThrelteContext

	// @TODO(mp): Better way to grab interactivity / dispatcher context
	const interactivityContext = [...component.$$.context.values()].find((ctx) => ctx.pointer)
	const dispatcherContext = [...component.$$.context.values()].find((ctx) => ctx.dispatchers)

	return {
		component,
		scene: threlteContext.scene,
		camera: threlteContext.camera,
		advance: threlteContext.advance,
		fireEvent: async (
			object3D: Object3D,
			event: keyof ThrelteEvents,
			payload?: IntersectionEvent<typeof event>
		) => {
			const eventDispatcher = dispatcherContext.dispatchers.get(object3D)
			console.log(eventDispatcher)
			eventDispatcher(event, payload)
			await tick()
		},
		rerender: async (props) => {
			if (props.props) {
				console.warn('rerender({ props: {...} }) deprecated, use rerender({...}) instead')
				props = props.props
			}
			component.$set(props)
			await tick()
		},
		unmount: () => {
			if (componentCache.has(component)) {
				component.$destroy()
			}
		}
	}
}

const cleanupAtContainer = (cached) => {
	const { target, component } = cached

	if (componentCache.has(component)) component.$destroy()

	if (target.parentNode === document.body) {
		document.body.removeChild(target)
	}

	containerCache.delete(cached)
}

export const cleanup = () => {
	Array.from(containerCache.keys()).forEach(cleanupAtContainer)
}

export const act = async (fn: () => Promise<unknown>) => {
	if (fn) {
		await fn()
	}
	return tick()
}

// @TODO export this from @threlte/extras
export type ThrelteEvents = {
	click: IntersectionEvent<MouseEvent>
	contextmenu: IntersectionEvent<MouseEvent>
	dblclick: IntersectionEvent<MouseEvent>
	wheel: IntersectionEvent<WheelEvent>
	pointerup: IntersectionEvent<PointerEvent>
	pointerdown: IntersectionEvent<PointerEvent>
	pointerover: IntersectionEvent<PointerEvent>
	pointerout: IntersectionEvent<PointerEvent>
	pointerenter: IntersectionEvent<PointerEvent>
	pointerleave: IntersectionEvent<PointerEvent>
	pointermove: IntersectionEvent<PointerEvent>
	pointermissed: MouseEvent
}
