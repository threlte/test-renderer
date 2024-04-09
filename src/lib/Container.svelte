<svelte:options accessors />

<script lang="ts">
	import { ACESFilmicToneMapping, type WebGLRenderer } from 'three'
	import type { SvelteComponent } from 'svelte'
	import { writable } from 'svelte/store'
	import { SceneGraphObject, createThrelteContext } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import { mockAdvanceFn } from './advance'

	export let canvas: HTMLCanvasElement
	export let component: typeof SvelteComponent
	export let ref: SvelteComponent | undefined = undefined

	const context = createThrelteContext({
		colorSpace: 'srgb',
		toneMapping: ACESFilmicToneMapping,
		dpr: 1,
		userSize: writable({ width: 1280, height: 720 }),
		parentSize: writable(),
		renderMode: 'manual',
		autoRender: true,
		shadows: true,
		colorManagementEnabled: true,
		useLegacyLights: false
	})

	context.renderer = { domElement: canvas } as WebGLRenderer

	mockAdvanceFn(context)

	interactivity({
		compute: () => undefined
	})
</script>

<SceneGraphObject object={context.scene}>
	<svelte:component this={component} bind:this={ref} {...$$restProps} />
</SceneGraphObject>
