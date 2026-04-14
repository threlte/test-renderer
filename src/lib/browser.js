import * as THREE from 'three'

/**
 * Get the canvas position of a mesh by name.
 *
 * @param {string} name
 * @param {THREE.Scene} scene
 * @param {HTMLCanvasElement} canvas
 * @returns {{ x: number; y: number } | undefined}
 */
function getMeshCanvasPositionByName(name, scene, canvas) {
  const mesh = scene.children.find((child) => child.name === name)
  if (!mesh) return undefined

  const vector = new THREE.Vector3()
  mesh.getWorldPosition(vector)

  const rect = canvas.getBoundingClientRect()
  const viewportX = rect.left + ((vector.x + 1) / 2) * rect.width
  const viewportY = rect.top + ((-vector.y + 1) / 2) * rect.height

  return {
    x: viewportX - rect.left,
    y: viewportY - rect.top,
  }
}

export { getMeshCanvasPositionByName }