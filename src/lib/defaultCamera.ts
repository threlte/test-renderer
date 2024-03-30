import { PerspectiveCamera } from 'three'
import { watch, type ThrelteContext } from '@threlte/core'

const defaultCamera = new PerspectiveCamera(75, 0, 0.1, 1000)
defaultCamera.position.z = 5
defaultCamera.lookAt(0, 0, 0)

export const getDefaultCamera = (): PerspectiveCamera => defaultCamera

export const setDefaultCameraAspectOnSizeChange = (ctx: ThrelteContext): void => {
	watch(ctx.size, (size) => {
		if (ctx.camera.current === defaultCamera) {
			const cam = ctx.camera.current as PerspectiveCamera
			cam.aspect = size.width / size.height
			cam.updateProjectionMatrix()
			ctx.invalidate()
		}
	})
}
