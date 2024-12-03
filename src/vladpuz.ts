import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import perfectionist from 'eslint-plugin-perfectionist'

import type { Config, Options } from './types.js'

import { defaultFiles, defaultOptions } from './defaults.js'

function vladpuz(options: Options = defaultOptions): Config[] {
  const {
    files = defaultOptions.files,
  } = options

  const {
    js = defaultFiles.js,
    ts = defaultFiles.ts,
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

    /* Rules stylistic */
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

    /* Config love */
    {
      files: [...js, ...ts],
      ...love,
    },

    /*
    * Disable all love config typescript rules
    * for javascript, except extension rules.
    */
    {
      files: js,
      rules: Object.fromEntries(
        Object.entries(love.rules ?? {}).map(([key, value]) => {
          const [pluginName, ruleName] = key.split('/')
          const isTypeScriptRule = pluginName === '@typescript-eslint' && ruleName != null

          if (!isTypeScriptRule) {
            return [key, value]
          }

          // https://typescript-eslint.io/rules/#extension-rules
          const isExtensionRule = ruleName in eslint.configs.all.rules
          return [key, isExtensionRule ? value : 'off']
        }),
      ),
    },

    /* Rules typescript */
    {
      files: ts,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
      },
    },

    /* Rules love */
    {
      rules: {
        'curly': ['error', 'all'],
        'arrow-body-style': ['error', 'always'],
        'complexity': ['off'],
        '@typescript-eslint/no-magic-numbers': ['off'],
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
  ]
}

export default vladpuz
