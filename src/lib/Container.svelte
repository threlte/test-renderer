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

	const context = createThrelteContext({
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

	const rendererMock = { domElement: canvas }
	/** @ts-expect-error We aren't interested in providing a full mock. */
	context.renderer = rendererMock

	mockAdvanceFn(context)

	interactivity({
		compute: () => undefined,
	})
</script>

<SceneGraphObject object={context.scene}>
	<svelte:component this={component} bind:this={ref} {...$$restProps} />
</SceneGraphObject>
