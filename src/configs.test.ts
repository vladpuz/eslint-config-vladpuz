import type { ESLint, Linter } from 'eslint'

import eslint from '@eslint/js'
import importLite from 'eslint-plugin-import-lite'
import n from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.ts'
import { getJavascriptConfig } from './configs/javascript.ts'
import { getNodeConfig } from './configs/node.ts'
import { getPerfectionistConfig } from './configs/perfectionist.ts'
import { getTypescriptConfig } from './configs/typescript.ts'
import { testPluginConfig } from './testPluginConfig.ts'

testPluginConfig(
  null,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  Object.fromEntries(builtinRules),
  getJavascriptConfig(),
  eslint.configs.recommended.rules,
)

testPluginConfig(
  '@typescript-eslint',
  ((tseslint.plugin as ESLint.Plugin).rules ?? {}),
  getTypescriptConfig({ strict: true }),
  [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ].reduce<Linter.RulesRecord>((acc, config) => {
    return { ...acc, ...config.rules }
  }, {}),
)

testPluginConfig(
  'import-lite',
  importLite.rules,
  getImportConfig(),
)

testPluginConfig(
  'n',
  n.rules ?? {},
  getNodeConfig(),
)

testPluginConfig(
  'perfectionist',
  perfectionist.rules ?? {},
  getPerfectionistConfig(),
)
