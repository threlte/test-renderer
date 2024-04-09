<script lang="ts">
	import { ACESFilmicToneMapping, type WebGLRenderer } from 'three'
	import { getContext, type SvelteComponent } from 'svelte'
	import { writable } from 'svelte/store'
	import { SceneGraphObject, createThrelteContext } from '@threlte/core'
	import { interactivity } from '@threlte/extras'

	export let canvas: HTMLCanvasElement = document.createElement('canvas')
	export let component: typeof SvelteComponent

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

	interface AdvanceOptions {
		count?: number
		delta?: number
	}

	const internalContext = getContext('threlte-internal-context')

	context.advance = (options: AdvanceOptions = {}) => {
		internalContext.dispose()

		for (let i = 0, c = options.count ?? 1; i < c; i += 1) {
			// @TODO(mp) Expose lastTime (marked private)? Allow more control over deltas in the run() call?
			// @ts-expect-error
			context.scheduler.lastTime = 0
			context.scheduler.run(options.delta ?? 16)
		}

		internalContext.resetFrameInvalidation()
	}

	interactivity({
		compute: () => undefined
	})
</script>

<SceneGraphObject object={context.scene}>
	<svelte:component this={component} {...$$restProps} />
</SceneGraphObject>
