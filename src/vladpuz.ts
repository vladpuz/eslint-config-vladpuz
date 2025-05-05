import type { TSESLint } from '@typescript-eslint/utils'

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import perfectionist from 'eslint-plugin-perfectionist'

export const GLOBS_JS = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
export const GLOBS_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

export interface Options {
  filesJs?: string[]
  filesTs?: string[]
}

const defaultOptions: Required<Options> = {
  filesJs: GLOBS_JS,
  filesTs: GLOBS_TS,
}

function vladpuz(
  options: Options = defaultOptions,
): TSESLint.FlatConfig.Config[] {
  const {
    filesJs = defaultOptions.filesJs,
    filesTs = defaultOptions.filesTs,
  } = options

  return [
    /* Config stylistic */
    stylistic.configs.customize({
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

    {
      rules: {
        '@stylistic/max-len': ['error', {
          code: 80,
          tabWidth: 2,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        }],
      },
    },

    /* Config love */
    {
      files: [...filesJs, ...filesTs],
      ...love,
    },

    /*
     * Disable all love config typescript rules
     * for javascript, except extension rules.
     */
    {
      files: filesJs,
      rules: Object.fromEntries(
        Object.entries(love.rules ?? {}).map(([key, value]) => {
          const [pluginName, ruleName] = key.split('/')
          const isTypescriptRule = pluginName === '@typescript-eslint' && ruleName != null

          if (!isTypescriptRule) {
            return [key, value]
          }

          // https://typescript-eslint.io/rules/#extension-rules
          const isExtensionRule = ruleName in eslint.configs.all.rules
          return [key, isExtensionRule ? value : 'off']
        }),
      ),
    },

    {
      files: filesTs,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/prefer-readonly': 'off',
      },
    },

    {
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/prefer-destructuring': 'off',
        '@typescript-eslint/class-methods-use-this': 'off',
      },
    },

    {
      rules: {
        'curly': ['error', 'all'],
        'arrow-body-style': ['error', 'always'],
        'complexity': 'off',
        'max-lines': 'off',
        'max-depth': 'off',
        'max-nested-callbacks': 'off',
        'no-console': 'off',
      },
    },

    /* Plugin promise */
    {
      rules: {
        'promise/avoid-new': 'off',
      },
    },

    /* Plugin import */
    {
      rules: {
        'import/no-cycle': 'error',
      },
    },

    /* Plugin n */
    {
      rules: {
        'n/prefer-node-protocol': 'error',
      },
    },

    /* Plugin eslint-comments */
    {
      rules: {
        'eslint-comments/require-description': 'off',
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
