import type { ESLint, Linter } from 'eslint'

import eslint from '@eslint/js'
import importLite from 'eslint-plugin-import-lite'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.ts'
import { getJavascriptConfig } from './configs/javascript.ts'
import { getPerfectionistConfig } from './configs/perfectionist.ts'
import { getTypescriptConfig } from './configs/typescript.ts'
import { getUnicornConfig } from './configs/unicorn.ts'
import { testPluginConfig } from './testPluginConfig.ts'

// These rules are opinionated
/* eslint-disable @typescript-eslint/no-non-null-assertion */
unicorn.configs.unopinionated.rules!['unicorn/no-negated-condition'] = 'off'
unicorn.configs.unopinionated.rules!['unicorn/prefer-event-target'] = 'off'
unicorn.configs.unopinionated.rules!['unicorn/import-style'] = 'off'
/* eslint-enable @typescript-eslint/no-non-null-assertion */

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
  getTypescriptConfig({}),
  [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    // eslint-disable-next-line unicorn/no-array-reduce
  ].reduce<Linter.RulesRecord>((acc, config) => {
    return { ...acc, ...config.rules }
  }, {}),
)

testPluginConfig(
  'unicorn',
  unicorn.rules ?? {},
  getUnicornConfig(),
  Object.entries(unicorn.configs.unopinionated.rules ?? {})
  // eslint-disable-next-line unicorn/no-array-reduce
    .reduce<Linter.RulesRecord>((acc, [ruleName, ruleConfig]) => {
      return (ruleConfig == null) ? acc : { ...acc, [ruleName]: ruleConfig }
    }, {}),
)

testPluginConfig(
  'import-lite',
  importLite.rules,
  getImportConfig(),
)

testPluginConfig(
  'perfectionist',
  perfectionist.rules ?? {},
  getPerfectionistConfig(),
)
