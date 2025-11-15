import vladpuz from './build/index.js'

export default [
  ...vladpuz(),
  {
    name: 'sort',
    files: ['src/configs/*.ts'],
    rules: {
      'perfectionist/sort-objects': ['error', {
        type: 'unsorted',
        useConfigurationIf: {
          allNamesMatchPattern: '^name|basePath|files|ignores|extends|language|languageOptions|linterOptions|processor|plugins|rules|settings$',
        },
      }],
    },
  },
  {
    name: 'extensions',
    ignores: ['eslint.config.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: ['**/*.js'],
      }],
    },
  },
]
