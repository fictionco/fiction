// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(

  {
    typescript: {
      tsconfigPath: './tsconfig.json',
      parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.vue', '.json'],
      },
    },
    rules: {
      'no-irregular-whitespace': 'warn',
      'import/no-cycle': ['error', { maxDepth: 5 }],
      'max-statements-per-line': ['error', { max: 2 }],
      'eqeqeq': 'warn',
      'vue/eqeqeq': 'warn',
      'no-undef-init': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'no-async-promise-executor': 'off',
      'unused-imports/no-unused-vars': 'warn',
      'vue/no-unused-refs': 'warn',
      'vue/max-attributes-per-line': ['error', { singleline: { max: 5 }, multiline: { max: 1 } }],
      'ts/consistent-type-definitions': 'off',
      'ts/strict-boolean-expressions': ['error', {
        allowNullableString: true,
        allowNullableBoolean: true,
      }],
      'no-alert': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'jsonc/sort-keys': 'off',
      'vue/no-mutating-props': ['error', { shallowOnly: true }],
      'style/max-statements-per-line': ['error', { max: 2 }],
      'ts/no-unsafe-assignment': 'off',
      'ts/no-throw-literal': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-misused-promises': 'off',
      'vue/no-ref-as-operand': 'error',
      'regexp/no-super-linear-backtracking': 'warn',
      'regexp/no-unused-capturing-group': 'warn',
    },
  },
  { ignores: [
    '**/.ref/**/*',
    '**/.ref-*/**/*',
    '**/__*',
    'node_modules',
    'dist/',
    'cache/',
    '**/.fiction/**',
    '.pnpmfile.cjs',
    'docs/**/*.md',
  ] },
)
