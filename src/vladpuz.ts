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

    if (parserOptions.ecmaFeatures?.jsx != null) {
      throw new Error(
        'Use "options.jsx" instead of "options.typescript.ecmaFeatures.jsx"',
      )
    }

    const tsconfigRootDir = parserOptions.tsconfigRootDir ?? process.cwd()
    const compilerOptions = getCompilerOptions(tsconfigRootDir)
    const configTs = getTypescriptConfig(filesTs, compilerOptions)

    // Setup parser
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

    const rulesTs = configTs.rules ?? {}

    // Disable equivalent js rules
    for (const ruleName of Object.keys(rulesTs)) {
      const [, ...ruleNameRest] = ruleName.split('/')
      const rule = ruleNameRest.join('/')

      const hasJsRule = rule in rulesJs

      if (hasJsRule) {
        rulesTs[rule] = 'off'
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const tsHandledRules = (
      tseslint.configs.eslintRecommended.rules ?? {}
    ) as Linter.RulesRecord

    // Disable ts handled js rules
    for (const [ruleName, ruleEntry] of Object.entries(tsHandledRules)) {
      const ruleSeverity = Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry

      if (ruleSeverity === 'off') {
        rulesTs[ruleName] = 'off'
      }
    }

    config.push(configTs)
  }

  config.push(
    getImportConfig(filesJsAndTs),
  )

  config.push(
    getNodeConfig(filesJsAndTs),
  )

  config.push(
    getPerfectionistConfig(filesJsAndTs),
  )

  config.push(
    getPromiseConfig(filesJsAndTs),
  )

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
