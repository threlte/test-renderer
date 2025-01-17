<svelte:options accessors />

<script>
	import { T, createThrelteContext } from '@threlte/core'
	import { ACESFilmicToneMapping } from 'three'
	import { interactivity } from '@threlte/extras'
	import { mockAdvanceFn } from './advance'
	import { getContext, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	/** @type {HTMLCanvasElement} */
	export let canvas

	/** @type {typeof import('svelte').SvelteComponent} */
	export let component

	/** @type {Record<string, unknown> | undefined} */
	export let componentProps

	/** @type {import('svelte').SvelteComponent | undefined} */
	export let ref = undefined

	/** @type {{ height: number, width: number }} */
	export let userSize = { height: 720, width: 1280 }

	if (!globalThis.ResizeObserver) {
		globalThis.ResizeObserver = class {
			observe = () => {}
			unobserve = () => {}
			disconnect = () => {}
		}
	}

	export const threlteContext = createThrelteContext({
		autoRender: true,
		colorManagementEnabled: true,
		colorSpace: 'srgb',
		dpr: 1,
		parentSize: writable(),
		renderMode: 'manual',
		shadows: true,
		toneMapping: ACESFilmicToneMapping,
		useLegacyLights: false,
		userSize: writable(userSize),
		// @ts-expect-error Support for Threlte 8
		canvas,
		dom: canvas.parentElement,
	})

	/** @type {{
	 *   dispose: () => void,
	 *   frameInvalidated: boolean,
	 *   resetFrameInvalidation: () => void
	 * }}
	 */
	export const internalContext = getContext('threlte-internal-context')

	/**
	 * We aren't interested as of now in providing a full mock.
	 *
	 * @type {any}
	 */
	const rendererMock = { domElement: canvas }
	threlteContext.renderer = rendererMock

	mockAdvanceFn(threlteContext, internalContext)

	setContext('threlte-cache', [])

	export const interactivityContext = interactivity()
</script>

<T is={threlteContext.scene}>
	<svelte:component this={component} bind:this={ref} {...componentProps} />
</T>
