import type { Linter } from 'eslint'

import stylistic, {
  type StylisticCustomizeOptions,
} from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.js'
import { getJsConfig } from './configs/js.js'
import { getNodeConfig } from './configs/node.js'
import { getPerfectionistConfig } from './configs/perfectionist.js'
import { getPromiseConfig } from './configs/promise.js'
import { getTsConfig } from './configs/ts.js'
import { getTsConfigJson } from './getTsConfigJson.js'

export type StylisticOptions = Pick<
  StylisticCustomizeOptions,
  'indent' | 'quotes' | 'semi'
>

export const FILES_JS = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
export const FILES_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

export interface Options {
  filesJs?: string[]
  filesTs?: string[]
  env?: (keyof typeof globals)[]
  stylistic?: boolean | StylisticOptions
  typescript?: boolean | string
  jsx?: boolean
}

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
  env.forEach((env) => {
    const envGlobals: Linter.Globals = globals[env]

    for (const key in envGlobals) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = envGlobals[key]!
      resolvedGlobals[key] = value
    }
  })

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

  const jsConfig = getJsConfig(filesJsAndTs)
  const jsRules = jsConfig.rules ?? {}

  config.push(jsConfig)

  if (enableTypescript !== false) {
    const tsconfigRootDir = (typeof enableTypescript === 'string')
      ? enableTypescript
      : process.cwd()

    const tsConfigJson = getTsConfigJson(tsconfigRootDir)
    const tsConfig = getTsConfig(filesTs, tsConfigJson)

    // Setup parser
    tsConfig.languageOptions = {
      // @ts-expect-error: parser
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
        ecmaFeatures: {
          jsx: enableJsx,
        },
      },
    }

    const tsRules = tsConfig.rules ?? {}

    // Disable equivalent js rules
    for (const ruleName in tsRules) {
      const [, ...ruleNameRest] = ruleName.split('/')
      const rule = ruleNameRest.join('/')

      const hasJsRule = rule in jsRules

      if (hasJsRule) {
        tsRules[rule] = 'off'
      }
    }

    const tsHandledRules = tseslint.configs.eslintRecommended.rules ?? {}

    // Disable ts handled js rules
    for (const ruleName in tsHandledRules) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ruleEntry = tsHandledRules[ruleName]!

      const ruleSeverity = Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry

      if (ruleSeverity === 'off') {
        tsRules[ruleName] = 'off'
      }
    }

    config.push(tsConfig)
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
      ...((typeof enableStylistic === 'object') ? enableStylistic : {}),
    }

    const styleConfig = stylistic.configs.customize(stylisticOptions)
    const styleConfigPlugins = styleConfig.plugins ?? {}
    const styleConfigRules = styleConfig.rules ?? {}

    const indent = stylisticOptions.indent

    styleConfigRules['@stylistic/max-len'] = ['error', {
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
      name: 'vladpuz/style',
      files: filesJsAndTs,
      plugins: styleConfigPlugins,
      rules: styleConfigRules,
    })
  }

  return config
}

export default vladpuz
