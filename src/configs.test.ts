import { Linter, type Rule } from 'eslint'
import importLite from 'eslint-plugin-import-lite'
import n from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import promise from 'eslint-plugin-promise'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import tseslint from 'typescript-eslint'

import { getImportConfig } from './configs/import.ts'
import { getJsConfig } from './configs/js.ts'
import { getNodeConfig } from './configs/node.ts'
import { getPerfectionistConfig } from './configs/perfectionist.ts'
import { getPromiseConfig } from './configs/promise.ts'
import { getTsConfig } from './configs/ts.ts'
import { getTsConfigJson } from './getTsConfigJson.ts'

/* eslint @typescript-eslint/no-floating-promises: off */

const VALID_RULE_SEVERITY = new Set<Linter.RuleSeverity>(['error', 'off'])

function testConfigRules(
  pluginName: string | null,
  pluginRules: Record<string, Pick<Rule.RuleModule, 'meta'>>,
  config: Linter.Config,
): void {
  const configRules = config.rules ?? {}

  const notConsideredRules: string[] = []
  const deprecatedRules: string[] = []
  const invalidEntryRules: string[] = []
  const invalidSeverityRules: string[] = []

  const invalidNameRules: string[] = []

  Object.entries(pluginRules).forEach(([pluginRuleName, pluginRule]) => {
    const pluginRuleNameWithPrefix = (pluginName !== null)
      ? `${pluginName}/${pluginRuleName}`
      : pluginRuleName

    const ruleEntry = configRules[pluginRuleNameWithPrefix]
    const isDeprecated = Boolean(pluginRule.meta?.deprecated)

    if (ruleEntry == null) {
      if (isDeprecated) {
        return
      }

      notConsideredRules.push(pluginRuleNameWithPrefix)
      return
    }

    if (isDeprecated) {
      deprecatedRules.push(pluginRuleNameWithPrefix)
    }

    const isArrayRuleEntry = Array.isArray(ruleEntry)
    const ruleSeverity = isArrayRuleEntry ? ruleEntry[0] : ruleEntry

    const isInvalidRuleEntry = isArrayRuleEntry && ruleEntry[1] == null
    const isInvalidRuleSeverity = !VALID_RULE_SEVERITY.has(ruleSeverity)

    if (isInvalidRuleEntry) {
      invalidEntryRules.push(pluginRuleNameWithPrefix)
    }

    if (isInvalidRuleSeverity) {
      invalidSeverityRules.push(pluginRuleNameWithPrefix)
    }
  })

  Object.keys(configRules).forEach((rule) => {
    const split = rule.split('/')
    const ruleNameRest = (split.length > 1) ? split.slice(1) : split
    const ruleName = ruleNameRest.join('/')

    const pluginRule = pluginRules[ruleName]

    if (pluginRule == null) {
      invalidNameRules.push(rule)
    }
  })

  const describeName = (pluginName !== null)
    ? `Plugin "${pluginName}" config rules`
    : 'ESLint config rules'

  describe(describeName, () => {
    test('Snapshot of the schema has not been changed', (t) => {
      const snapshot: Record<string, unknown> = {}
      const pluginRulesEntries = Object.entries(pluginRules)

      pluginRulesEntries.sort(([a], [b]) => {
        return a.localeCompare(b)
      })

      pluginRulesEntries.forEach(([pluginRuleName, pluginRule]) => {
        const pluginRuleNameWithPrefix = (pluginName !== null)
          ? `${pluginName}/${pluginRuleName}`
          : pluginRuleName

        snapshot[pluginRuleNameWithPrefix] = pluginRule.meta?.schema
      })

      t.assert.snapshot(snapshot)
    })

    test('No not considered rules', () => {
      assert.deepStrictEqual(notConsideredRules, [])
    })

    test('No deprecated rules', () => {
      assert.deepStrictEqual(deprecatedRules, [])
    })

    test('No invalid entry rules', () => {
      assert.deepStrictEqual(invalidEntryRules, [])
    })

    test('No invalid severity rules', () => {
      assert.deepStrictEqual(invalidSeverityRules, [])
    })

    test('No invalid name rules', () => {
      assert.deepStrictEqual(invalidNameRules, [])
    })
  })
}

const linter = new Linter({
  configType: 'eslintrc',
})

testConfigRules(
  null,
  Object.fromEntries(linter.getRules()),
  getJsConfig([]),
)

testConfigRules(
  '@typescript-eslint',
  // @ts-expect-error: incompatible typing
  tseslint.plugin.rules ?? {},
  getTsConfig([], getTsConfigJson(process.cwd())),
)

testConfigRules(
  'import-lite',
  importLite.rules,
  getImportConfig([]),
)

testConfigRules(
  'n',
  n.rules ?? {},
  getNodeConfig([]),
)

testConfigRules(
  'perfectionist',
  perfectionist.rules,
  getPerfectionistConfig([]),
)

testConfigRules(
  'promise',
  promise.rules ?? {},
  getPromiseConfig([]),
)
