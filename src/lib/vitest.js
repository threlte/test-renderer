import { afterEach } from 'vitest'

import { act, cleanup } from './index.js'

afterEach(async () => {
	await act()
	cleanup()
})
