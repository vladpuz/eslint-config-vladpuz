import type { Linter } from 'eslint'

function errorifyConfigArray(configArray: Linter.Config[]): Linter.Config[] {
  const newConfigArray: Linter.Config[] = []

  for (const config of configArray) {
    newConfigArray.push(
      errorifyConfig(config),
    )
  }

  return newConfigArray
}

function errorifyConfig(config: Linter.Config): Linter.Config {
  const newConfig = { ...config }

  if (newConfig.rules) {
    newConfig.rules = errorifyRules(newConfig.rules)
  }

  return newConfig
}

function errorifyRules(rules: Partial<Linter.RulesRecord>): Linter.RulesRecord {
  const newRules: Linter.RulesRecord = {}

  for (const [ruleName, ruleConfig] of Object.entries(rules)) {
    if (ruleConfig == null) {
      continue
    }

    if (Array.isArray(ruleConfig)) {
      const [ruleSeverity, ...ruleOptions] = ruleConfig
      newRules[ruleName] = [errorifySeverity(ruleSeverity), ...ruleOptions]
    } else {
      newRules[ruleName] = errorifySeverity(ruleConfig)
    }
  }

  return newRules
}

function errorifySeverity(severity: Linter.RuleSeverity): Linter.RuleSeverity {
  if (severity === 'warn') {
    return 'error'
  }

  if (severity === 1) {
    return 2
  }

  return severity
}

const RULE_SEVERITIES = new Set<unknown>(['off', 0, 'warn', 1, 'error', 2])

function isRules(target: object): target is Linter.RulesRecord {
  return Object.values(target).every((value) => {
    if (Array.isArray(value) && RULE_SEVERITIES.has(value[0])) {
      return true
    } else if (RULE_SEVERITIES.has(value)) {
      return true
    }

    return false
  })
}

type Target = Linter.Config[] | Linter.Config | Linter.RulesRecord

export function errorify(target: Linter.Config[]): Linter.Config[]
export function errorify(target: Linter.Config): Linter.Config
export function errorify(target: Linter.RulesRecord): Linter.RulesRecord
export function errorify(target: Target): Target {
  if (Array.isArray(target)) {
    return errorifyConfigArray(target)
  }

  if (!isRules(target)) {
    return errorifyConfig(target)
  }

  return errorifyRules(target)
}
