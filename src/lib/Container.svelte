<script lang="ts">
	import { ACESFilmicToneMapping, type WebGLRenderer } from 'three'
	import type { SvelteComponent } from 'svelte'
	import { writable } from 'svelte/store'
	import { SceneGraphObject } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import { createContexts } from './createContexts'
	import { Scheduler } from './frame-scheduling'

	// @TODO(mp): createThrelteContext should be exposed in `@threlte/core`, for this and also for HUD
	const contexts = createContexts({
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

	contexts.getCtx().renderer = {
		domElement: document.createElement('canvas')
	} as WebGLRenderer

	// @TODO: Expose Scheduler from @threlte/core to avoid copying it here.
	const scheduler = new Scheduler()
	contexts.getCtx().mainStage = scheduler.createStage(Symbol('threlte-main-stage'))
	contexts.getCtx().renderStage = scheduler.createStage(Symbol('threlte-render-stage'), {
		after: contexts.ctx.mainStage,
		callback(_, runTasks) {
			if (contexts.ctx.shouldRender()) runTasks()
		}
	})

	interface AdvanceOptions {
		count?: number
		delta?: number
	}

	contexts.ctx.advance = (options: AdvanceOptions = {}) => {
		contexts.getInternalCtx().dispose()

		for (let i = 0, c = options.count ?? 1; i < c; i += 1) {
			// @TODO(mp) Expose lastTime (marked private)? Allow more control over deltas in the run() call?
			// @ts-expect-error
			scheduler.lastTime = 0
			scheduler.run(options.delta ?? 16)
		}

		contexts.getInternalCtx().resetFrameInvalidation()
	}

	interactivity({
		compute: () => undefined
	})

	export let component: typeof SvelteComponent
</script>

<SceneGraphObject object={contexts.ctx.scene}>
	<svelte:component this={component} {...$$restProps} />
</SceneGraphObject>
