import type { Linter } from 'eslint'

import perfectionist from 'eslint-plugin-perfectionist'

export function getPerfectionistConfig(): Linter.Config {
  return {
    name: 'vladpuz/perfectionist',
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-array-includes': 'off',
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-decorators': 'off',
      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-export-attributes': 'error',
      'perfectionist/sort-exports': 'error',
      'perfectionist/sort-heritage-clauses': 'off',
      'perfectionist/sort-import-attributes': 'error',
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-intersection-types': 'off',
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-maps': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-sets': 'off',
      'perfectionist/sort-switch-case': 'off',
      'perfectionist/sort-union-types': 'off',
      'perfectionist/sort-variable-declarations': 'off',
    },
  }
}
