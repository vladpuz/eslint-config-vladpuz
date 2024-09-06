import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

import type { Config } from './types.js'

export function vladpuz(): Config[] {
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

    /* ESLint rules */
    {
      rules: {
        'curly': ['error', 'all'],
        'arrow-body-style': ['error', 'always'],
      },
    },

    /* Plugin @stylistic */
    {
      rules: {
        '@stylistic/max-len': ['error', {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        }],
      },
    },

    /* Plugin @typescript-eslint */
    {
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
