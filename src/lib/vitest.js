import { act, cleanup } from './index.js'
import { afterEach } from 'vitest'

afterEach(async () => {
  await act()
  cleanup()
})
