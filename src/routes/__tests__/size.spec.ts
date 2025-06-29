import { describe, expect, it } from 'vitest'

import Subject from '../Invalidate.svelte'
import { render } from '../../lib'
import { tick } from 'svelte'

describe('size', () => {
  it('works', async () => {
    const { context, rerender } = render(Subject)

    await tick()

    expect(context.size.current.width).toBe(200)
    expect(context.size.current.height).toBe(200)
  })
})
