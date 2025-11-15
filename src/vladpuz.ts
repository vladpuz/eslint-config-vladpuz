import type { ParserOptions } from '@typescript-eslint/types'
import type { Linter } from 'eslint'

import stylistic, { type StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import gitignore, { type FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.ts'
import { getJavascriptConfig } from './configs/javascript.ts'
import { getNodeConfig } from './configs/node.ts'
import { getPerfectionistConfig } from './configs/perfectionist.ts'
import { getPromiseConfig } from './configs/promise.ts'
import { getTypescriptConfig } from './configs/typescript.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'

export const FILES_JS = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
export const FILES_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

export interface Options {
  filesJs?: string[]
  filesTs?: string[]
  env?: Array<keyof typeof globals>
  gitignore?: boolean | GitignoreOptions
  typescript?: boolean | ParserOptions
  stylistic?: boolean | StylisticOptions
  jsx?: boolean
}

export type GitignoreOptions = Omit<FlatGitignoreOptions, 'name'>

export type StylisticOptions = Pick<
  StylisticCustomizeOptions,
  'indent' | 'quotes' | 'semi'
>

function vladpuz(options: Options = {}): Linter.Config[] {
  const {
    filesJs = FILES_JS,
    filesTs = FILES_TS,
    env = ['node', 'browser'],
    gitignore: enableGitignore = true,
    typescript: enableTypescript = true,
    stylistic: enableStylistic = true,
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
      parserOptions: {
        ecmaFeatures: {
          jsx: enableJsx,
        },
      },
      globals: resolvedGlobals,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  })

  if (enableGitignore !== false) {
    const gitignoreOptions = (typeof enableGitignore === 'object')
      ? enableGitignore
      : {}

    const configGitignore = gitignore({
      strict: false,
      ...gitignoreOptions,
      name: 'vladpuz/gitignore',
    })

    config.push(configGitignore)
  }

  const configJs = getJavascriptConfig()
  const rulesJs = configJs.rules ?? {}
  config.push(configJs)

  if (enableTypescript !== false) {
    const parserOptions = (typeof enableTypescript === 'object')
      ? enableTypescript
      : {}

    const compilerOptions = getCompilerOptions(parserOptions)
    const configTs = getTypescriptConfig(compilerOptions)
    const rulesTs = configTs.rules ?? {}

    configTs.files = filesTs
    configTs.languageOptions = {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ...parserOptions,
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
        rulesTs[ruleName] = 'off'
      } else {
        const ruleEntryJs = rulesJs[ruleName] ?? 'off'

        let ruleSeverityJs: Linter.RuleSeverity = 'off'
        let ruleOptionsJs: unknown[] = []

        if (Array.isArray(ruleEntryJs)) {
          ruleSeverityJs = ruleEntryJs[0]
          ruleOptionsJs = ruleEntryJs.slice(1)
        } else {
          ruleSeverityJs = ruleEntryJs
        }

        if (ruleSeverityJs === 'off') {
          rulesJs[ruleName] = (ruleOptionsJs.length > 0)
            ? ['error', ...ruleOptionsJs]
            : 'error'
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

  const importConfig = getImportConfig()
  config.push(importConfig)

  const nodeConfig = getNodeConfig()
  config.push(nodeConfig)

  const perfectionistConfig = getPerfectionistConfig()
  config.push(perfectionistConfig)

  const promiseConfig = getPromiseConfig()
  config.push(promiseConfig)

  if (enableStylistic !== false) {
    const stylisticUserOptions = (typeof enableStylistic === 'object')
      ? enableStylistic
      : {}

    const stylisticOptions: StylisticCustomizeOptions = {
      indent: 2,
      quotes: 'single',
      semi: false,
      ...stylisticUserOptions,
      jsx: enableJsx,
      arrowParens: true,
      braceStyle: '1tbs',
      blockSpacing: true,
      quoteProps: 'consistent-as-needed',
      commaDangle: 'always-multiline',
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
      plugins: pluginsStylistic,
      rules: rulesStylistic,
    })
  }

  return config
}

export default vladpuz
