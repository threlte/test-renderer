import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { threlteTesting } from './src/lib/plugin'

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [sveltekit(), threlteTesting()],
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [{ browser: 'chromium' }],
    },
    // environment: 'happy-dom',
    coverage: { include: ['src'] },
    mockReset: true,
    unstubGlobals: true,
    alias: {
      '@threlte/test/plugin': require.resolve('./src/lib/plugin.js'),
      '@threlte/test': require.resolve('./src/lib/index.js'),
    },
  },
}))
