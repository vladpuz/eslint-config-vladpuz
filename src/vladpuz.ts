import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

import type { Config, Options } from './types.js'

import { defaultFiles, defaultOptions } from './constants.js'

export function vladpuz(options: Options = defaultOptions): Config[] {
  const {
    files = defaultOptions.files,
  } = options

  const {
    js = defaultFiles.js,
    ts = defaultFiles.ts,
  } = files

  const loveRules = love.rules ?? {}

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

    /* Plugin @typescript-eslint */
    {
      files: ts,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
      },
    },

    /* Plugin n */
    {
      rules: {
        'n/prefer-node-protocol': 'error',
      },
    },

    /* Plugin perfectionist */
    {
      plugins: {
        perfectionist,
      },
      rules: {
        'perfectionist/sort-imports': 'error',
        'perfectionist/sort-exports': 'error',
        'perfectionist/sort-named-imports': 'error',
        'perfectionist/sort-named-exports': 'error',
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
