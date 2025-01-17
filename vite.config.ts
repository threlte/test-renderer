import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	ssr: {
		noExternal: ['three'],
	},
	test: {
		coverage: {
			include: ['src'],
			provider: 'v8',
		},
		environment: 'jsdom',
		mockReset: true,
		unstubGlobals: true,
	},
})
