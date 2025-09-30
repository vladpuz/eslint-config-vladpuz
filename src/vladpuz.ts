import type { ParserOptions } from '@typescript-eslint/types'
import type { Linter } from 'eslint'

import stylistic, { type StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.js'
import { getJavascriptConfig } from './configs/javascript.js'
import { getNodeConfig } from './configs/node.js'
import { getPerfectionistConfig } from './configs/perfectionist.js'
import { getPromiseConfig } from './configs/promise.js'
import { getTypescriptConfig } from './configs/typescript.js'
import { getCompilerOptions } from './getCompilerOptions.js'

export const FILES_JS = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
export const FILES_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

export interface Options {
  filesJs?: string[]
  filesTs?: string[]
  env?: Array<keyof typeof globals>
  stylistic?: boolean | StylisticOptions
  typescript?: boolean | ParserOptions
  jsx?: boolean
}

export type StylisticOptions = Pick<
  StylisticCustomizeOptions,
  'indent' | 'quotes' | 'semi'
>

function vladpuz(options: Options = {}): Linter.Config[] {
  const {
    filesJs = FILES_JS,
    filesTs = FILES_TS,
    env = ['node', 'browser'],
    stylistic: enableStylistic = true,
    typescript: enableTypescript = true,
    jsx: enableJsx = true,
  } = options

  const filesJsAndTs = (enableTypescript !== false)
    ? [...filesJs, ...filesTs]
    : filesJs

  const resolvedGlobals: Linter.Globals = {}

  for (const envItem of env) {
    for (const [key, value] of Object.entries(globals[envItem])) {
      resolvedGlobals[key] = value
    }
  }

  const config: Linter.Config[] = []

  config.push({
    name: 'vladpuz/base',
    files: filesJsAndTs,
    languageOptions: {
      globals: resolvedGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: enableJsx,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  })

  const configJs = getJavascriptConfig(filesJsAndTs)
  const rulesJs = configJs.rules ?? {}
  config.push(configJs)

  if (enableTypescript !== false) {
    const parserOptions = (typeof enableTypescript === 'object')
      ? enableTypescript
      : {}

    const compilerOptions = getCompilerOptions(parserOptions)
    const configTs = getTypescriptConfig(filesTs, compilerOptions)
    const rulesTs = configTs.rules ?? {}

    configTs.languageOptions = {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ...parserOptions,
        ecmaFeatures: {
          ...parserOptions.ecmaFeatures,
          jsx: enableJsx,
        },
      },
    }

    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const tsCompatibilityRules = (
      tseslint.configs.eslintRecommended.rules ?? {}
    ) as Linter.RulesRecord

    for (const [ruleName, ruleEntry] of Object.entries(tsCompatibilityRules)) {
      const ruleSeverity = Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry

      if (ruleSeverity === 'off' || ruleSeverity === 0) {
        rulesTs[ruleName] = ruleEntry
      } else {
        const ruleEntryJs = rulesJs[ruleName]
        const ruleSeverityJs = Array.isArray(ruleEntryJs)
          ? ruleEntryJs[0]
          : ruleEntryJs

        if (ruleSeverityJs === 'off' || ruleSeverityJs === 0) {
          rulesJs[ruleName] = ruleEntry
        }
      }
    }

    // Disable equivalent js rules (extension rules replace the base rules)
    for (const ruleName of Object.keys(rulesTs)) {
      const ruleNameOnly = ruleName.split('/').slice(1).join('/')
      const hasJsRule = ruleNameOnly in rulesJs

      if (hasJsRule) {
        rulesTs[ruleNameOnly] = 'off'
      }
    }

    config.push(configTs)
  }

  const importConfig = getImportConfig(filesJsAndTs)
  config.push(importConfig)

  const nodeConfig = getNodeConfig(filesJsAndTs)
  config.push(nodeConfig)

  const perfectionistConfig = getPerfectionistConfig(filesJsAndTs)
  config.push(perfectionistConfig)

  const promiseConfig = getPromiseConfig(filesJsAndTs)
  config.push(promiseConfig)

  if (enableStylistic !== false) {
    const stylisticUserOptions = (typeof enableStylistic === 'object')
      ? enableStylistic
      : {}

    const stylisticOptions: StylisticCustomizeOptions = {
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: enableJsx,
      arrowParens: true,
      braceStyle: '1tbs',
      blockSpacing: true,
      quoteProps: 'consistent-as-needed',
      commaDangle: 'always-multiline',
      ...stylisticUserOptions,
    }

    const configStylistic = stylistic.configs.customize(stylisticOptions)
    const pluginsStylistic = configStylistic.plugins ?? {}
    const rulesStylistic = configStylistic.rules ?? {}
    const indent = stylisticOptions.indent

    rulesStylistic['@stylistic/max-len'] = ['error', {
      code: 80,
      tabWidth: (indent === 'tab') ? 4 : indent,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }]

    config.push({
      name: 'vladpuz/stylistic',
      files: filesJsAndTs,
      plugins: pluginsStylistic,
      rules: rulesStylistic,
    })
  }

  return config
}

export default vladpuz
