import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

import { GLOBS_JS, GLOBS_PACKAGE_JSON, GLOBS_SRC, GLOBS_TS } from './globs.js'

const defaultFiles = {
  js: GLOBS_JS,
  ts: GLOBS_TS,
  src: GLOBS_SRC,
  packageJson: GLOBS_PACKAGE_JSON,
}

const defaultOptions = {
  files: defaultFiles,
  perfectionistConfig: 'recommended-natural',
  flatCompatConfig: {},
}

function vladpuz(options = defaultOptions) {
  const {
    files = defaultOptions.files,
    perfectionistConfig = defaultOptions.perfectionistConfig,
    flatCompatConfig = defaultOptions.flatCompatConfig,
  } = options

  const {
    js: jsFiles = defaultFiles.js,
    ts: tsFiles = defaultFiles.ts,
    src: srcFiles = defaultFiles.src,
    packageJson: packageJsonFiles = defaultFiles.packageJson,
  } = files

  /* FlatCompat */
  const flatCompat = new FlatCompat(flatCompatConfig)
  const flatCompatPlugins = flatCompat.plugins('json-files')

  return [
    ...flatCompatPlugins,

    /* Config love */
    {
      ...love,
      files: srcFiles,
    },

    /* Overrides ts */
    {
      files: tsFiles,
      rules: {
        // https://github.com/mightyiam/eslint-config-love/issues/111
        '@typescript-eslint/explicit-member-accessibility': 'error',
      },
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

    /* Disable all typescript rules for javascript, except extension rules */
    {
      files: jsFiles,
      rules: Object.fromEntries(Object.entries(love.rules).map(([key, value]) => {
        const isTypescriptRule = key.startsWith('@typescript-eslint')
        const isExtensionRule = isTypescriptRule
          ? key.split('/')[1] in love.rules
          : false

        // https://typescript-eslint.io/rules/#extension-rules
        const isDisabled = isTypescriptRule && !isExtensionRule
        return [key, isDisabled ? 'off' : value]
      })),
    },

    /* Plugin stylistic */
    stylistic.configs.customize({
      braceStyle: '1tbs',
    }),

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

    /* Plugin json-files */
    {
      files: packageJsonFiles,
      rules: {
        'json-files/sort-package-json': 'error',
      },
    },
  ]
}

export default vladpuz
