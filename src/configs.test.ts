import { type ESLint, Linter } from 'eslint'
import importLite from 'eslint-plugin-import-lite'
import n from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import promise from 'eslint-plugin-promise'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.ts'
import { getJavascriptConfig } from './configs/javascript.ts'
import { getNodeConfig } from './configs/node.ts'
import { getPerfectionistConfig } from './configs/perfectionist.ts'
import { getPromiseConfig } from './configs/promise.ts'
import { getTypescriptConfig } from './configs/typescript.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import { testPluginConfig } from './testPluginConfig.ts'

const linter = new Linter({
  configType: 'eslintrc',
})

testPluginConfig(
  null,
  Object.fromEntries(linter.getRules()),
  getJavascriptConfig([]),
)

testPluginConfig(
  '@typescript-eslint',
  ((tseslint.plugin as ESLint.Plugin).rules ?? {}),
  getTypescriptConfig([], getCompilerOptions(process.cwd())),
)

testPluginConfig(
  'import-lite',
  importLite.rules,
  getImportConfig([]),
)

testPluginConfig(
  'n',
  n.rules ?? {},
  getNodeConfig([]),
)

testPluginConfig(
  'perfectionist',
  perfectionist.rules,
  getPerfectionistConfig([]),
)

testPluginConfig(
  'promise',
  promise.rules ?? {},
  getPromiseConfig([]),
)
