## @threlte/test

`@threlte/test` is a lightweight component testing toolkit for Threlte.

```
npm i @threlte/test
```

It supports Svelte 5 + Threlte 8 onwards.

```ts
import { describe, it, expect } from 'vitest'
import { render } from '@threlte/test'
import Scene from './Scene.svelte'

describe('Scene', () => {
  it('creates a box mesh with a boxGeometry and meshStandardMaterial', () => {
    const { scene } = render(Scene)

    const mesh = scene.getObjectByProperty('isMesh', true) as Mesh
    expect(mesh).toBeDefined()
    expect(mesh.material).toBeInstanceOf(MeshStandardMaterial)
    expect(mesh.geometry).toBeInstanceOf(BoxGeometry)
  })
})
```

It provides a function, `render`, which will instantiate a Threlte context and whatever component you pass to it.

Calling `render` will provide useful tools for testing your component's behavior.

```ts
const {
  component, // SvelteComponent
  scene, // THREE.Scene
  camera, // CurrentWritable<THREE.Camera>
  advance, // ({ count?: number; delta?: number }) => { frameInvalidated: boolean }
  fireEvent, // (object3D: THREE.Object3D, event, payload) => Promise<void>
  rerender, // (props) => Promise<void>
  unmount, // () => void
} = render(Component)
```

### Scene

`scene` is the `THREE.Scene` created by a Threlte context without any modifications. Querying objects from it can be useful for verifying that your component is doing what you expect it to.

### Advance

If you wish to test results produced by running `useTask`, you must call `advance`. `advance` runs the scheduler and returns `{ frameInvalidated }` indicating whether the frame needed rendering. The delta defaults to 16ms but can be configured.

```ts
// Runs advance() 10 times with a 33.3ms delta
advance({ delta: 33.3, count: 10 })
```

`advance` returns `{ frameInvalidated: boolean }`, which reflects whether `shouldRender()` was true for that frame. This is useful for testing on-demand and manual render mode invalidation logic.

```ts
const { advance } = render(MyComponent)

const { frameInvalidated } = advance()
expect(frameInvalidated).toBe(true)
```

#### First advance after render

The first `advance()` call after `render()` will always return `{ frameInvalidated: true }`. This is expected — Threlte's internal setup (renderer properties, camera, resize detection) calls `invalidate()` during initialization, just as it does in production on the first animation frame.

When testing invalidation behavior, call `advance()` once to drain the setup invalidation, then use subsequent calls for your assertions:

```ts
const { advance, rerender } = render(MyComponent, {
  props: { autoInvalidate: false },
})

// Drain setup invalidation
advance()

// Now test real invalidation behavior
const { frameInvalidated } = advance()
expect(frameInvalidated).toBe(false)

// Trigger invalidation via prop change
await rerender({ someProp: 'newValue' })

const result = advance()
expect(result.frameInvalidated).toBe(true)
```

### fireEvent

If your component uses the `interactivity` plugin, you can test events using the `fireEvent` function. Let's say we have a component like this:

```svelte
<script>
  let { onclick } = $props()
</script>

<T.Mesh {onclick} />
```

We can write a test like this:

```ts
const onclick = vi.fn()
const { render, fireEvent } = render(Scene, {
  props: { onclick }
})

const mesh = scene.getObjectByName('myMesh')
await fireEvent(mesh, 'click', someOptionalCustomPayload)
expect(onclick).toHaveBeenCalledOnce()
```

Note that if you use the event object, you will have to design a mock payload.

### Setup

`@threlte/test` currently only supports vitest as your test runner. To get started, add the `threlteTesting` plugin to your Vite or Vitest config.

```ts
// vite.config.js
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { threlteTesting } from '@threlte/test/vite'

export default defineConfig({
  plugins: [
    svelte(),
    threlteTesting(),
  ]
});
```

Additionally, the [Vitest environment](https://vitest.dev/guide/environment.html) must be set to a DOM enviroment, like happy-dom or vitest browser mode.

### Limitations

The test renderer runs in a node.js environment, unless if running in vite browser mode. It creates a Threlte context and renders your component with this context provided. This must be considered when testing `<Canvas>` or `WebGLRenderer` related configuration and behavior.
