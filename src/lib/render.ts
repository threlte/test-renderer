import { SvelteComponent, tick } from 'svelte'
import Container from './Container.svelte'
import type { ThrelteContext } from '@threlte/core'
import type { IntersectionEvent } from '@threlte/extras'
import type { Object3D } from 'three'

const componentCache = new Set<SvelteComponent>()

export const render = (
	Component: typeof SvelteComponent,
	{ target, ...options }: { target?: HTMLElement } & Record<string, unknown> = {},
	{ container = document.body, canvas = document.createElement('canvas') } = {}
) => {
	const component = new Container({
		target: (target = target ?? container.appendChild(document.createElement('div'))),
		props: {
			canvas,
			component: Component,
			...options
		}
	})

	componentCache.add(component)

	const threlteContext = component.$$.context.get('threlte') as ThrelteContext

	// @TODO(mp): Better way to grab interactivity / dispatcher context
	// const interactivityContext = [...component.$$.context.values()].find((ctx) => ctx.pointer)
	const dispatcherContext = [...component.$$.context.values()].find((ctx) => ctx.dispatchers)

	return {
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
		componentCache.delete(component)
	}
}

export const act = async (fn?: () => Promise<unknown>) => {
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

// If we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then either import the `pure` module
// or set the STL_SKIP_AUTO_CLEANUP env variable to 'true'.
if (typeof afterEach === 'function' && !process.env.STL_SKIP_AUTO_CLEANUP) {
	afterEach(async () => {
		await act()
		cleanup()
	})
}
