<svelte:options accessors />

<script>
	import { ACESFilmicToneMapping } from 'three'
	import { SvelteComponent } from 'svelte'
	import { writable } from 'svelte/store'
	import { SceneGraphObject, createThrelteContext } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import { mockAdvanceFn } from './advance'

	/** @type {HTMLCanvasElement} */
	export let canvas

	/** @type {typeof SvelteComponent} */
	export let component

	/** @type {SvelteComponent | undefined} */
	export let ref = undefined

	/** @type {{ width: number, height: number }} */
	export let userSize = { width: 1280, height: 720 }

	export const threlteContext = createThrelteContext({
		colorSpace: 'srgb',
		toneMapping: ACESFilmicToneMapping,
		dpr: 1,
		userSize: writable(userSize),
		parentSize: writable(),
		renderMode: 'manual',
		autoRender: true,
		shadows: true,
		colorManagementEnabled: true,
		useLegacyLights: false,
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
		compute: () => undefined,
	})
</script>

<SceneGraphObject object={threlteContext.scene}>
	<svelte:component this={component} bind:this={ref} {...$$restProps} />
</SceneGraphObject>
