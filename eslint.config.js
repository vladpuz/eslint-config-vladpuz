import { FlatCompat } from '@eslint/eslintrc'
import love from 'eslint-config-love'
import esx from 'eslint-plugin-es-x'
import perfectionist from 'eslint-plugin-perfectionist'

/* FlatCompat */
const flatCompat = new FlatCompat()
const flatCompatPlugins = flatCompat.plugins('json-files')

/* Files */
const jsonFiles = ['**/*.json']
const javascriptFiles = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']
const codeFiles = [...javascriptFiles, ...typescriptFiles]

/* Constants */
const perfectionistConfig = 'recommended-natural'
const typescriptRulesPrefix = '@typescript-eslint/'

const eslintConfig = [
  ...flatCompatPlugins,

  /* Config love */
  {
    ...love,
    files: codeFiles
  },

  /* Overrides typescript */
  {
    files: typescriptFiles,
    rules: {
      // https://github.com/mightyiam/eslint-config-love/issues/111
      '@typescript-eslint/explicit-member-accessibility': 'error'
    }
  },

  /* Overrides code */
  {
    files: codeFiles,
    rules: {
      curly: ['error', 'all'],
      // https://github.com/standard/standard/issues/1144
      'arrow-body-style': ['error', 'always'],
      'arrow-parens': ['error', 'always']
    }
  },

  /* Disable all typescript rules for javascript, except extension rules */
  {
    files: javascriptFiles,
    rules: Object.fromEntries(Object.entries(love.rules).map(([key, value]) => {
      const isTypescriptRule = key.startsWith(typescriptRulesPrefix)
      const isExtensionRule = isTypescriptRule
        ? key.split(typescriptRulesPrefix)[1] in love.rules
        : false

      const isDisabled = isTypescriptRule && !isExtensionRule
      return [key, isDisabled ? 'off' : value]
    }))
  },

  /* Plugin perfectionist */
  {
    files: codeFiles,
    plugins: {
      perfectionist
    },
    rules: {
      'perfectionist/sort-exports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-exports'],
      'perfectionist/sort-imports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-imports'],
      'perfectionist/sort-named-exports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-named-exports'],
      'perfectionist/sort-named-imports': perfectionist.configs[perfectionistConfig].rules['perfectionist/sort-named-imports']
    }
  },

  /* Plugin es-x */
  {
    files: codeFiles,
    plugins: { 'es-x': esx },
    rules: {
      'es-x/no-optional-chaining': 'error'
    }
  },

  /* Plugin json-files */
  {
    files: jsonFiles,
    rules: {
      'json-files/sort-package-json': 'error'
    }
  }
]

export default eslintConfig
