import { describe, expect, it, vi } from 'vitest'
import { render } from '../../lib'
import Subject from '../Scene.svelte'
import { userEvent } from 'vitest/browser'

describe('SceneBrowser', () => {
  it('calls the onclick callback when the box mesh is clicked', async () => {
    const onclick = vi.fn()
    const { container, rerender, position } = render(Subject, {
      props: { onclick },
    })

    const rerenderAndClickBox = async (x: number) => {
      await rerender({ x })

      await userEvent.click(container, {
        position: position('box-1'),
      })
    }

    await rerenderAndClickBox(0.0)
    expect(onclick).toHaveBeenCalledOnce()

    onclick.mockClear()
    await rerenderAndClickBox(0.6)
    expect(onclick).toHaveBeenCalledOnce()

    onclick.mockClear()
    await rerenderAndClickBox(3) // this one is out of the camera frustrum so click should not be called
    expect(onclick).not.toHaveBeenCalled()
  })
})
