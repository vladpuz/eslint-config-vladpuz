import type { Linter, Rule } from 'eslint'

import assert from 'node:assert'
import { describe, test } from 'node:test'

/* eslint @typescript-eslint/no-floating-promises: off */

const VALID_RULE_SEVERITY = new Set<Linter.RuleSeverity>(['error', 'off'])

export function testPluginConfig(
  pluginName: string | null,
  pluginRules: Record<string, Rule.RuleModule>,
  config: Linter.Config,
): void {
  const configRules = config.rules ?? {}

  const notConsideredRules: string[] = []
  const deprecatedRules: string[] = []
  const invalidEntryRules: string[] = []
  const invalidSeverityRules: string[] = []

  const invalidNameRules: string[] = []

  for (const [pluginRuleName, pluginRule] of Object.entries(pluginRules)) {
    const pluginRuleNameWithPrefix = (pluginName !== null)
      ? `${pluginName}/${pluginRuleName}`
      : pluginRuleName

    const ruleEntry = configRules[pluginRuleNameWithPrefix]
    const isDeprecated = Boolean(pluginRule.meta?.deprecated)

    if (ruleEntry == null) {
      if (isDeprecated) {
        continue
      }

      notConsideredRules.push(pluginRuleNameWithPrefix)
      continue
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
  }

  for (const rule of Object.keys(configRules)) {
    const split = rule.split('/')
    const ruleNameRest = (split.length > 1) ? split.slice(1) : split
    const ruleName = ruleNameRest.join('/')

    const pluginRule = pluginRules[ruleName]

    if (pluginRule == null) {
      invalidNameRules.push(rule)
    }
  }

  const describeName = (pluginName !== null)
    ? `Plugin "${pluginName}" config`
    : 'ESLint config'

  describe(describeName, () => {
    test('Snapshot of the schema has not been changed', (t) => {
      const snapshot: Record<string, unknown> = {}
      const pluginRulesEntries = Object.entries(pluginRules)

      pluginRulesEntries.sort(([a], [b]) => {
        return a.localeCompare(b)
      })

      for (const [pluginRuleName, pluginRule] of pluginRulesEntries) {
        const pluginRuleNameWithPrefix = (pluginName !== null)
          ? `${pluginName}/${pluginRuleName}`
          : pluginRuleName

        snapshot[pluginRuleNameWithPrefix] = pluginRule.meta?.schema
      }

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
