import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { threlteTesting } from './src/lib/plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [sveltekit(), threlteTesting()],
	ssr: {
		noExternal: ['three'],
	},
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
		},
		coverage: {
			include: ['src'],
			provider: 'v8',
		},
		mockReset: true,
		unstubGlobals: true,
	},
})
