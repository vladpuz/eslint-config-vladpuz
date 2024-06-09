import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

import { defaultFiles, defaultOptions } from './constants.js'
import { type Config, type Options } from './types.js'

function vladpuz(options: Options = defaultOptions): Config[] {
  const {
    files = defaultOptions.files,
    perfectionistConfig = defaultOptions.perfectionistConfig,
  } = options

  const {
    js: jsFiles = defaultFiles.js,
    ts: tsFiles = defaultFiles.ts,
    src: srcFiles = defaultFiles.src,
  } = files

  return [
    /* Config stylistic */
    stylistic.configs.customize({
      flat: true,
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
      arrowParens: true,
      braceStyle: '1tbs',
      blockSpacing: true,
      quoteProps: 'consistent-as-needed',
      commaDangle: 'always-multiline',
    }),

    /* Config love */
    {
      ...love,
      files: srcFiles,
    },

    /* Overrides src */
    {
      files: srcFiles,
      rules: {
        'curly': ['error', 'all'],
        // https://github.com/standard/standard/issues/1144
        'arrow-body-style': ['error', 'always'],
      },
    },

    /* Overrides ts */
    {
      files: tsFiles,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
      },
    },

    /* Disable all typescript rules for javascript, except extension rules */
    {
      files: jsFiles,
      rules: Object.fromEntries(Object.entries(love.rules).map(([key, value]) => {
        const [pluginName, ruleName] = key.split('/')
        const isTypescriptRule = pluginName === '@typescript-eslint' && ruleName != null
        const isExtensionRule = isTypescriptRule
          ? ruleName in love.rules
          : false

        // https://typescript-eslint.io/rules/#extension-rules
        const isDisabled = isTypescriptRule && !isExtensionRule
        return [key, isDisabled ? 'off' : value]
      })),
    },

    /* Plugin perfectionist */
    {
      files: srcFiles,
      plugins: {
        perfectionist,
      },
      rules: {
        'perfectionist/sort-exports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-exports'],
        'perfectionist/sort-imports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-imports'],
        'perfectionist/sort-named-exports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-named-exports'],
        'perfectionist/sort-named-imports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-named-imports'],
      },
    },

    /* Plugin es-x */
    {
      files: srcFiles,
      plugins: { 'es-x': esx },
      rules: {
        'es-x/no-optional-chaining': 'error',
      },
    },
  ]
}

export default vladpuz
