/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,

	env: {
		browser: true,
		es2017: true,
		node: true,
	},

	extends: [
		'eslint:all',
		'plugin:@typescript-eslint/strict',
		'plugin:@typescript-eslint/stylistic',
		'plugin:svelte/recommended',
		'prettier',
	],

	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		sourceType: 'module',
	},

	plugins: ['@typescript-eslint'],

	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],

	rules: {
		'arrow-body-style': ['error', 'always'],
		'max-lines-per-function': ['error', 200],
		'max-statements': ['error', 20, { ignoreTopLevelFunctions: true }],
		'no-magic-numbers': 'off',
		'no-ternary': 'off',
		'one-var': ['error', 'never'],
		'sort-keys': ['error', 'asc', { allowLineSeparatedGroups: true }],
	},
}
