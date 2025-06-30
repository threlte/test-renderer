<script>
  import { createThrelteContext, useScheduler } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { mockAdvanceFn } from './advance'
  import { mockCanvas } from './canvas'

  /**
   * @type {{
   *   canvas: HTMLCanvasElement
   *   component: typeof import('svelte').SvelteComponent
   *   ref: import('svelte').SvelteComponent | import('svelte').Component | undefined
   *   [key: string]: any
   * }}
   */
  let {
    canvas = document.createElement('canvas'),
    component: Component,
    ref,
    ...rest
  } = $props()

  const dom = document.createElement('div')
  dom.style = 'position: relative; width: 100%; height: 100%;'
  dom.append(canvas)

  canvas.style =
    'display: block; position: relative; width: 100%; height: 100%;'
  mockCanvas(canvas)

  /** @type {import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>} */
  export const context = createThrelteContext({
    renderMode: 'on-demand',
    canvas,
    dom,
  })
  export const scheduler = useScheduler()
  scheduler.resetFrameInvalidation()

  export const advance = mockAdvanceFn()
  export const interactivityContext = interactivity()
</script>

<Component bind:this={ref} {...rest} />
