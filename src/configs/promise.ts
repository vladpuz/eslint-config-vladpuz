import type { Linter } from 'eslint'

import promise from 'eslint-plugin-promise'

export function getPromiseConfig(files: string[]): Linter.Config {
  return {
    name: 'vladpuz/promise',
    files,
    plugins: {
      promise,
    },
    rules: {
      'promise/always-return': 'off',
      'promise/avoid-new': 'off',
      'promise/catch-or-return': 'off',
      'promise/no-callback-in-promise': 'off',
      'promise/no-multiple-resolved': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'off',
      'promise/no-new-statics': 'off',
      'promise/no-promise-in-callback': 'off',
      'promise/no-return-in-finally': 'off',
      'promise/no-return-wrap': 'off',
      'promise/param-names': 'off',
      'promise/prefer-await-to-callbacks': 'off',
      'promise/prefer-await-to-then': ['error', { strict: true }],
      'promise/prefer-catch': 'off',
      'promise/spec-only': 'off',
      'promise/valid-params': 'off',
    },
  }
}
