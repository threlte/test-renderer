import js from '@eslint/js'
import globals from 'globals'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier'
import ts from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import svelteConfig from './svelte.config.js'

export default ts.config(
  prettier,
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  ...svelte.configs.prettier,
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: 'ignores',
    ignores: ['.svelte-kit', 'dist', 'build'],
  },
  {
    files: [
      '**/*.svelte',
      '**/*.svelte.js',
      '**/*.svelte.ts',
      '../*.svelte.config.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'], // Add support for additional file extensions, such as .svelte
        parser: ts.parser,
        // Specify a parser for each language, if needed:
        // parser: {
        //   ts: ts.parser,
        //   js: espree,    // Use espree for .js files (add: import espree from 'espree')
        //   typescript: ts.parser
        // },

        // We recommend importing and specifying svelte.config.js.
        // By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
        // While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
        // explicitly specifying it ensures better compatibility and functionality.
        svelteConfig,
      },
    },
  },
  {
    rules: {
      'array-bracket-newline': ['error', 'consistent'],
      'array-element-newline': 'off',
      'arrow-body-style': 'off',
      'max-len': 'off',
      'quote-props': 'off',
      camelcase: ['error', { properties: 'never' }],
      'capitalized-comments': 'off',
      complexity: 'off',
      'default-case': 'off',
      'default-last-param': 'off',
      'dot-location': ['error', 'property'],
      'func-names': 'off',
      'function-call-argument-newline': ['error', 'consistent'],
      'id-length': 'off',
      'init-declarations': 'off',
      'linebreak-style': ['error', 'unix'],
      'lines-around-comment': 'off',
      'lines-between-class-members': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'multiline-comment-style': 'off',
      'multiline-ternary': ['error', 'always-multiline'],
      'no-bitwise': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-continue': 'off',
      'no-extra-parens': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-undef-init': 'off',
      'object-curly-spacing': ['error', 'always'],
      'object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      'one-var': ['error', 'never'],
      'padded-blocks': ['error', 'never'],
      'prefer-destructuring': 'off',
      'sort-keys': 'off',
      'sort-imports': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'never'],

      'unicorn/no-useless-undefined': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-keyword-prefix': ['error', { checkProperties: false }],
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',

      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  }
)
