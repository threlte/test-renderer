### Threlte test renderer

The test renderer is a lightweight unit testing toolkit for Threlte components.

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
