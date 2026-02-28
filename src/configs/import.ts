import type { Linter } from 'eslint'

import importLite from 'eslint-plugin-import-lite'

export function getImportConfig(): Linter.Config {
  return {
    name: 'vladpuz/import',
    plugins: {
      'import-lite': importLite,
    },
    rules: {
      'import-lite/consistent-type-specifier-style': 'off',
      'import-lite/exports-last': 'off',
      'import-lite/first': 'error',
      'import-lite/newline-after-import': 'error',
      'import-lite/no-default-export': 'off',
      'import-lite/no-duplicates': 'error',
      'import-lite/no-mutable-exports': 'error',
      'import-lite/no-named-default': 'error',
      'import-lite/prefer-default-export': 'off',
    },
  }
}
