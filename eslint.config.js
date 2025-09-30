import vladpuz from './build/index.js'

const config = vladpuz()

config.push({
  ignores: ['build'],
})

config.push({
  files: ['src/configs/*.ts'],
  rules: {
    'perfectionist/sort-objects': ['error', {
      type: 'unsorted',
      useConfigurationIf: {
        allNamesMatchPattern: '^name|basePath|files|ignores|extends|language|languageOptions|linterOptions|processor|plugins|rules|settings$',
      },
    }],
  },
})

export default config
