import { describe, expect, it, vi } from 'vitest'
import { render } from '../../lib'
import { getMeshCanvasPositionByName } from '../../lib/browser'
import Subject from '../Scene.svelte'
import { userEvent } from 'vitest/browser'

describe('SceneBrowser', () => {
  it('renders a scene browser', async () => {
    const onclick = vi.fn()
    const { scene, container } = render(Subject, { props: { onclick } })

    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    if (!canvas) return


    const position = getMeshCanvasPositionByName('box-1', scene, canvas)
    expect(position).not.toBeNull()
    if (!position) return
    expect(position.x).toBeDefined()
    expect(position.y).toBeDefined()

    await userEvent.click(canvas, {
			position: position
		})

    expect(onclick).toHaveBeenCalledOnce()
  })
})