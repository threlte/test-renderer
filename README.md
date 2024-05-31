### Threlte test renderer

The `@threlte/test` is a lightweight component testing toolkit for Threlte components.

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
	advance, // (delta?: number) => void
	fireEvent, // (object3D: THREE.Object3D, event, payload) => Promise<void>
	rerender, // (props) => Promise<void>
	unmount // () => void
} = render(Component)
```

#### Scene

`scene` is the `THREE.Scene` created by a Threlte context without any modifications. Querying objects from it can be useful for verifying that your component is doing what you expect it to.

#### Advance

In the test renderer environment, Threlte's render mode is set to `manual`. `advance` is very similar to the function of the same name returned by the `useThrelte` hook, but it advances at a fixed rate (16ms) regardless of environment. The number of times called and delta can also be configured when calling it.

```ts
// Runs advance() 10 times with a 33.3ms delta
advance({ delta: 33.3, count: 10 })
```

#### fireEvent

If your component uses the `interactivity` plugin, you can test events using the `fireEvent` function. Let's say we have a component like this:

```svelte
<script lang="ts">
	export let onClick
</script>

<T.Mesh on:click={onClick}>...</T.Mesh>
```

We can write a test like this:

```ts
const onClick = vi.fn()
const { render, fireEvent } = render(Scene, { onClick })

const mesh = scene.getObjectByName('myMesh')
await fireEvent(mesh, 'click', someOptionalCustomPayload)
expect(onClick).toHaveBeenCalledOnce()
```

Note that if you use the event object, you will have to design a mock payload.

#### Cleanup

In a vitest environment, cleanup after each test is automatically handled.

#### Limitations

The test renderer runs in a node.js environment, and it does not attempt to mock a webgl canvas, which can become quite complicated. Instead, it creates a Threlte context and renders your component as a child of a Threlte `<SceneGraphObject>`. This means that testing `<Canvas>` or `WebGLRenderer` related configuration and behavior won't work.

This libary's primary purpose, however, is to allow you to test whether your component works in isolation as you intend it to work.
