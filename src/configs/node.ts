import type { Linter } from 'eslint'

import n from 'eslint-plugin-n'

export function getNodeConfig(files: string[]): Linter.Config {
  return {
    name: 'vladpuz/node',
    files,
    plugins: {
      n,
    },
    rules: {
      'n/callback-return': 'off',
      'n/exports-style': 'off',
      'n/file-extension-in-import': 'off',
      'n/global-require': 'off',
      'n/handle-callback-err': 'off',
      'n/hashbang': 'off',
      'n/no-callback-literal': 'off',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-mixed-requires': 'off',
      'n/no-new-require': 'off',
      'n/no-path-concat': 'off',
      'n/no-process-env': 'off',
      'n/no-process-exit': 'off',
      'n/no-restricted-import': 'off',
      'n/no-restricted-require': 'off',
      'n/no-sync': 'off',
      'n/no-top-level-await': 'off',
      'n/no-unpublished-bin': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/console': 'off',
      'n/prefer-global/process': 'off',
      'n/prefer-global/text-decoder': 'off',
      'n/prefer-global/text-encoder': 'off',
      'n/prefer-global/url': 'off',
      'n/prefer-global/url-search-params': 'off',
      'n/prefer-node-protocol': 'error',
      'n/prefer-promises/dns': 'off',
      'n/prefer-promises/fs': 'off',
      'n/process-exit-as-throw': 'error',
    },
  }
}
