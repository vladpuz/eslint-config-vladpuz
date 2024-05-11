import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'
import tseslint from 'typescript-eslint'

/* compat */
const compat = new FlatCompat()

const compatPlugins = compat.plugins('json-files')
const compatExtendsJavascript = compat.extends('standard')
const compatExtendsTypescript = compat.extends('love')

/* constants */
const jsonFiles = ['**/*.json']
const javascriptFiles = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']
const codeFiles = [...javascriptFiles, ...typescriptFiles]
const perfectionistConfig = 'recommended-natural'

const eslintConfig = [
  ...compatPlugins,

  ...compatExtendsJavascript.map((config) => {
    return {
      ...config,
      files: javascriptFiles
    }
  }),

  ...compatExtendsTypescript.map((config) => {
    return {
      ...config,
      files: typescriptFiles
    }
  }),

  /* eslint */
  {
    files: codeFiles,
    rules: {
      // override
      curly: ['error', 'all'],
      // https://github.com/standard/standard/issues/1144
      'arrow-body-style': ['error', 'always'],
      'arrow-parens': ['error', 'always']
    }
  },

  /* typescript-eslint */
  {
    files: typescriptFiles,
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      // https://github.com/mightyiam/eslint-config-love/issues/111
      '@typescript-eslint/explicit-member-accessibility': 'error'
    }
  },

  /* perfectionist */
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

  /* json-files */
  {
    files: jsonFiles,
    rules: {
      'json-files/sort-package-json': 'error'
    }
  }
]

export default eslintConfig
