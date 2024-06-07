import { describe, expect, it } from 'vitest'

import Subject from '../Invalidate.svelte'
import { render } from '../../lib'

describe('<Invalidate>', () => {
	it('does not invalidate on a frozen useTask', () => {
		const { advance } = render(Subject)

		const { frameInvalidated } = advance()

		expect(frameInvalidated).toBe(false)
	})

	it('invalidates on a running useTask', () => {
		const { advance } = render(Subject, { autoStart: true })

		const { frameInvalidated } = advance()

		expect(frameInvalidated).toBe(false)
	})

	it('does not invalidate when autoInvalidate is false on a running useTask', () => {
		const { advance } = render(Subject, { autoInvalidate: false, autoStart: true })

		const { frameInvalidated } = advance()

		expect(frameInvalidated).toBe(false)
	})

	// @TODO ongoing discussion
	it.skip('does not invalidate when a prop change does not call invalidate()', () => {
		const { frameInvalidated } = render(Subject, { prop1: 10 })
		expect(frameInvalidated).toBe(false)
	})
})
