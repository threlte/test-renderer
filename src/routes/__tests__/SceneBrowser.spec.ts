import { describe, expect, it, vi } from 'vitest'
import { render, getMeshCanvasPositionByName } from '../../lib'
import Subject from '../Scene.svelte'
import { userEvent } from 'vitest/browser'

describe('SceneBrowser', () => {
  it('calls the onclick callback when the box mesh is clicked', async () => {
    const onclick = vi.fn()
    const { scene, container, camera, advance, rerender } = render(Subject, { props: { onclick } })
    advance()

    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    if (!canvas) return


    const rerenderAndClickBox = async (x: number) => {
      await rerender({ x })
      const nextPosition = getMeshCanvasPositionByName('box-1', scene, canvas, camera.current)
      expect(nextPosition).not.toBeNull()
      if (!nextPosition) return
      expect(nextPosition.x).toBeDefined()
      expect(nextPosition.y).toBeDefined()

      await userEvent.click(canvas, {
        position: nextPosition
      })
    }

    await rerenderAndClickBox(0.0)
    expect(onclick).toHaveBeenCalledOnce()

    onclick.mockClear()
    await rerenderAndClickBox(0.6)
    expect(onclick).toHaveBeenCalledOnce()
    
    onclick.mockClear()
    await rerenderAndClickBox(3) // this one is out of the camera frustrum so 
    expect(onclick).not.toHaveBeenCalled()
  })
})