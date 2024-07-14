import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

import { defaultFiles, defaultOptions } from './constants.js'
import { type Config, type Options } from './types.js'

export function vladpuz(options: Options = defaultOptions): Config[] {
  const {
    files = defaultOptions.files,
  } = options

  const {
    js = defaultFiles.js,
    ts = defaultFiles.ts,
  } = files

  const loveRules = love.rules ?? {}
  const perfectionistRules = perfectionist.configs['recommended-alphabetical'].rules ?? {}

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
    love,

    /* Overrides */
    {
      rules: {
        'curly': ['error', 'all'],
        'arrow-body-style': ['error', 'always'],
      },
    },

    /* Overrides ts */
    {
      files: ts,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
      },
    },

    /* Disable all typescript rules for javascript, except extension rules */
    {
      files: js,
      rules: Object.fromEntries(Object.entries(loveRules).map(([key, value]) => {
        const [pluginName, ruleName] = key.split('/')
        const isTypescriptRule = pluginName === '@typescript-eslint' && ruleName != null

        if (!isTypescriptRule) {
          return [key, value]
        }

        // https://typescript-eslint.io/rules/#extension-rules
        const isExtensionRule = ruleName in loveRules
        return [key, isExtensionRule ? value : 'off']
      })),
    },

    /* Plugin perfectionist */
    {
      plugins: {
        perfectionist,
      },
      rules: {
        'perfectionist/sort-imports': perfectionistRules['perfectionist/sort-imports'],
        'perfectionist/sort-exports': perfectionistRules['perfectionist/sort-exports'],
        'perfectionist/sort-named-imports': perfectionistRules['perfectionist/sort-named-imports'],
        'perfectionist/sort-named-exports': perfectionistRules['perfectionist/sort-named-exports'],
      },
    },

    /* Plugin es-x */
    {
      plugins: {
        'es-x': esx,
      },
      rules: {
        'es-x/no-optional-chaining': 'error',
      },
    },
  ]
}
