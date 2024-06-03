<svelte:options accessors />

<script>
	import { SceneGraphObject, createThrelteContext } from '@threlte/core'

	import { ACESFilmicToneMapping } from 'three'
	import { interactivity } from '@threlte/extras'
	import { mockAdvanceFn } from './advance'
	import { writable } from 'svelte/store'

	/** @type {HTMLCanvasElement} */
	export let canvas

	/** @type {typeof import('svelte').SvelteComponent} */
	export let component

	/** @type {import('svelte').SvelteComponent | undefined} */
	export let ref = undefined

	/** @type {{ height: number, width: number }} */
	export let userSize = { height: 720, width: 1280 }

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
	})

	/**
	 * We aren't interested as of now in providing a full mock.
	 *
	 * @type {any}
	 */
	const rendererMock = { domElement: canvas }
	threlteContext.renderer = rendererMock

	mockAdvanceFn(threlteContext)

	export const interactivityContext = interactivity({
		compute: () => {
			return undefined
		},
	})
</script>

<SceneGraphObject object={threlteContext.scene}>
	<svelte:component this={component} bind:this={ref} {...$$restProps} />
</SceneGraphObject>
