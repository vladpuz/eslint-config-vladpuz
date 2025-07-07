import { Linter, type Rule } from 'eslint'
import importLite from 'eslint-plugin-import-lite'
import n from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import promise from 'eslint-plugin-promise'
import tseslint from 'typescript-eslint'

function generateConfigRules(
  pluginName: string | null,
  pluginRules: Record<string, Pick<Rule.RuleModule, 'meta'>>,
): void {
  const rules: Record<string, 'off'> = {}

  for (const pluginRuleName in pluginRules) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pluginRule = pluginRules[pluginRuleName]!

    const isDeprecated = Boolean(pluginRule.meta?.deprecated)

    if (isDeprecated) {
      continue
    }

    const ruleName = (pluginName !== null)
      ? `${pluginName}/${pluginRuleName}`
      : pluginRuleName

    rules[ruleName] = 'off'
  }

  console.log(rules)
}

const linter = new Linter({
  configType: 'eslintrc',
})

console.log('js')
generateConfigRules(
  null,
  Object.fromEntries(linter.getRules()),
)

console.log('ts')
generateConfigRules(
  '@typescript-eslint',
  // @ts-expect-error: incompatible typing
  tseslint.plugin.rules ?? {},
)

console.log('import')
generateConfigRules(
  'import-lite',
  importLite.rules,
)

console.log('node')
generateConfigRules(
  'n',
  n.rules ?? {},
)

console.log('perfectionist')
generateConfigRules(
  'perfectionist',
  perfectionist.rules,
)

console.log('promise')
generateConfigRules(
  'promise',
  promise.rules ?? {},
)
