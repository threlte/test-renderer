import { BoxGeometry, type Mesh, MeshStandardMaterial } from 'three'
import { describe, expect, it, vi } from 'vitest'

import Scene from '../Scene.svelte'
import { render } from '../../lib'

describe('Scene', () => {
	it('creates an ambient and directional light', () => {
		const { scene } = render(Scene)

		expect(scene.getObjectByProperty('isAmbientLight', true)).toBeDefined()
		expect(scene.getObjectByProperty('isDirectionalLight', true)).toBeDefined()
	})

	it('creates a box mesh with a boxGeometry and meshStandardMaterial', () => {
		const { scene } = render(Scene)

		const mesh = scene.getObjectByProperty('isMesh', true) as Mesh
		expect(mesh).toBeDefined()
		expect(mesh.material).toBeInstanceOf(MeshStandardMaterial)
		expect(mesh.geometry).toBeInstanceOf(BoxGeometry)
	})

	it('creates a default perspective camera at position [1, 1, 1]', () => {
		const { camera } = render(Scene)

		expect(camera.current.position.toArray()).toStrictEqual([1, 1, 1])
	})

	it('rotates the box mesh on the x and y axis by the frame delta on each frame', () => {
		const { scene, advance } = render(Scene)

		const mesh = scene.getObjectByProperty('isMesh', true) as Mesh
		expect(mesh.rotation.x).toBe(0)
		expect(mesh.rotation.y).toBe(0)

		advance()

		expect(mesh.rotation.x).toBe(0.016)
		expect(mesh.rotation.y).toBe(0.016)
	})

	it('calls the onClick callback when the box mesh is clicked', async () => {
		const onClick = vi.fn()
		const { scene, fireEvent } = render(Scene, { onClick })

		const mesh = scene.getObjectByProperty('isMesh', true) as Mesh
		await fireEvent(mesh, 'click')
		expect(onClick).toHaveBeenCalledOnce()
	})
})
