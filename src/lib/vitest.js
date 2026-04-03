import { act, cleanup } from './index.js'
import { beforeEach } from 'vitest'

const afterEach = async () => {
  await act()
  cleanup()
}

beforeEach(() => {
  return afterEach
})
