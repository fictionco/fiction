module.exports = [
  {
    extends: ['./@factor/lint/config.cjs'],
    overrides: [
      {
        files: ['*.vue'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
        },
      },
    ],
    settings: {
      tailwindcss: {
        config: require.resolve('@fiction/studio/tailwind.config.cjs'),
      },
    },
  },
]
