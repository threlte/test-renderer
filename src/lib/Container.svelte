<script>
  import { T, createThrelteContext } from '@threlte/core'
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
  dom.style = `position: relative; width: 100%; height: 100%;`
  dom.append(canvas)

  canvas.style = `display: block; position: relative; width: 100%; height: 100%;`
  mockCanvas(canvas)

  /** @type {import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>} */
  export const threlteContext = createThrelteContext({
    renderMode: 'manual',
    canvas,
    dom,
  })
  export const advance = mockAdvanceFn(threlteContext)
  export const interactivityContext = interactivity()
</script>

<T is={threlteContext.scene} attach={false}>
  <Component bind:this={ref} {...rest} />
</T>
