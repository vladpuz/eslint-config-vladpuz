import type { Linter, Rule } from 'eslint'

import assert from 'node:assert'
import { describe, test } from 'node:test'

/* eslint @typescript-eslint/no-floating-promises: off */

const VALID_RULE_SEVERITIES = new Set<Linter.RuleSeverity>(['error', 'off'])

export function testPluginConfig(
  pluginName: string | null,
  pluginRules: Record<string, Rule.RuleModule>,
  config: Linter.Config,
  recommendedRules?: Linter.RulesRecord,
): void {
  const configRules = config.rules ?? {}

  const snapshot: Record<string, unknown> = {}
  const missingRules: string[] = []
  const deprecatedRules: string[] = []
  const invalidConfigRules: string[] = []
  const invalidSeverityRules: string[] = []
  const invalidNameRules: string[] = []
  const disabledRecommendedRules: string[] = []

  const pluginRulesEntries = Object
    .entries(pluginRules)
    .toSorted(([a], [b]) => {
      return a.localeCompare(b)
    })

  for (const [ruleName, ruleModule] of pluginRulesEntries) {
    const pluginRuleName = (pluginName !== null)
      ? `${pluginName}/${ruleName}`
      : ruleName

    snapshot[pluginRuleName] = ruleModule.meta?.schema

    const ruleConfig = configRules[pluginRuleName]
    const isDeprecated = Boolean(ruleModule.meta?.deprecated)

    if (ruleConfig == null) {
      if (isDeprecated) {
        continue
      }

      missingRules.push(pluginRuleName)
      continue
    }

    if (isDeprecated) {
      deprecatedRules.push(pluginRuleName)
    }

    const isArrayRuleConfig = Array.isArray(ruleConfig)
    const ruleSeverity = isArrayRuleConfig ? ruleConfig[0] : ruleConfig

    const isInvalidRuleConfig = isArrayRuleConfig && ruleConfig[1] == null
    const isInvalidRuleSeverity = !VALID_RULE_SEVERITIES.has(ruleSeverity)

    if (isInvalidRuleConfig) {
      invalidConfigRules.push(pluginRuleName)
    }

    if (isInvalidRuleSeverity) {
      invalidSeverityRules.push(pluginRuleName)
    }
  }

  for (const ruleName of Object.keys(configRules)) {
    const ruleNameParts = ruleName.split('/')
    const ruleNameOnly = (ruleNameParts.length > 1)
      ? ruleNameParts.slice(1).join('/')
      : ruleNameParts.join('/')

    const pluginRule = pluginRules[ruleNameOnly]

    if (!pluginRule) {
      invalidNameRules.push(ruleName)
    }
  }

  for (const [ruleName, ruleConfig] of Object.entries(recommendedRules ?? {})) {
    if (pluginName !== null && !ruleName.startsWith(pluginName)) {
      continue
    }

    const ruleSeverity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig

    if (ruleSeverity === 'off' || ruleSeverity === 0) {
      continue
    }

    const configRule = configRules[ruleName]

    if (configRule == null) {
      continue
    }

    const configRuleSeverity = Array.isArray(configRule)
      ? configRule[0]
      : configRule

    if (configRuleSeverity === 'off') {
      disabledRecommendedRules.push(ruleName)
    }
  }

  const describeName = (pluginName !== null)
    ? `Plugin "${pluginName}" config`
    : 'ESLint config'

  describe(describeName, () => {
    test('Snapshot of the schema has not been changed', (t) => {
      t.assert.snapshot(snapshot)
    })

    test('Has name', () => {
      assert.notEqual(config.name, null)
    })

    if (pluginName !== null) {
      test('Has plugin', () => {
        assert.notEqual(config.plugins?.[pluginName], null)
      })
    }

    test('No missing rules', () => {
      assert.deepStrictEqual(missingRules, [])
    })

    test('No deprecated rules', () => {
      assert.deepStrictEqual(deprecatedRules, [])
    })

    test('No invalid config rules', () => {
      assert.deepStrictEqual(invalidConfigRules, [])
    })

    test('No invalid severity rules', () => {
      assert.deepStrictEqual(invalidSeverityRules, [])
    })

    test('No invalid name rules', () => {
      assert.deepStrictEqual(invalidNameRules, [])
    })

    if (recommendedRules) {
      test('No disabled recommended rules', () => {
        assert.deepStrictEqual(disabledRecommendedRules, [])
      })
    }
  })
}
