import { describe, expect, it } from 'vitest'

import Subject from '../Invalidate.svelte'
import { render } from '../../lib'

describe('<Invalidate>', () => {
  it('does not invalidate on a frozen useTask', () => {
    const { context, advance } = render(Subject, {
      props: {
        autoStart: false,
        autoInvalidate: false,
      },
    })

    advance()
    expect(context.shouldRender()).toBe(false)
  })

  it('invalidates on a running useTask', async () => {
    const { context, advance } = render(Subject, {
      props: {
        autoStart: true,
        autoInvalidate: true,
      },
    })

    advance()
    expect(context.shouldRender()).toBe(true)
  })

  it('does not invalidate when autoInvalidate is false on a running useTask', () => {
    const { context, advance } = render(Subject, {
      props: {
        autoInvalidate: false,
        autoStart: true,
      },
    })

    advance()
    expect(context.shouldRender()).toBe(false)
  })

  it('invalidates on an invalidate() call', async () => {
    const { context, advance } = render(Subject, {
      props: {
        autoInvalidate: false,
        autoStart: false,
        prop1: 10,
      },
    })

    advance()
    expect(context.shouldRender()).toBe(true)
  })
})
