import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [sveltekit()],
		resolve: {
			/*
			 * Ensure `browser` exports are used in tests
			 * Vitest prefers modules' `node` export by default
			 * Svelte's `node` export is its SSR bundle, which does not have onMount
			 * https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1909993331
			 */
			conditions: mode === 'test' ? ['browser'] : [],
		},
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
			setupFiles: ['./src/lib/vitest.js'],
			unstubGlobals: true,
		},
	}
})
