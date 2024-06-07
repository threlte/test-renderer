/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Svelte from 'svelte'
import * as THREE from 'three'
import type { CurrentWritable, ThrelteContext } from '@threlte/core'
import type { IntersectionEvent, interactivity } from '@threlte/extras'

export { act, cleanup, render } from './pure'

/** @TODO export from @threlte/extras */

type ThrelteEvents =
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

export function act(fn?: (() => Promise<void>) | (() => void)): Promise<void>

export function cleanup(): void

export function render(
	component: typeof Svelte.SvelteComponent<any, any, any>,
	componentOptions?: { target?: HTMLElement } & Record<string, unknown>,
	renderOptions?: {
		baseElement?: HTMLElement
		canvas?: HTMLCanvasElement
		userSize?: { width: number; height: number }
	}
): {
	baseElement: HTMLElement
	camera: CurrentWritable<THREE.PerspectiveCamera | THREE.OrthographicCamera>
	component: Svelte.SvelteComponent<any, any, any>
	container: HTMLElement
	context: ThrelteContext
	scene: THREE.Scene
	// @TODO export from @threlte/extras
	interactivity: ReturnType<typeof interactivity>
	frameInvalidated: boolean

	advance: (options?: { count?: number; delta?: number }) => { frameInvalidated: boolean }

	fireEvent(
		object3D: THREE.Object3D,
		event: ThrelteEvents,
		payload?: IntersectionEvent<ThrelteEvents>
	): Promise<void>

	rerender(props: Record<string, unknown>): Promise<void>

	unmount(): void
}
