## 3.0.0

- ESLint 10 support.
- Plugin eslint-plugin-promise has been removed.
- Updated eslint-plugin-perfectionist to v5.
- Updated globals to v17.
- Added a new argument to the testPluginConfig function for testing the use of
  recommended rules. Type `recommendedRules?: Linter.RulesRecord`.
- Rules changes:
  - radix - changed config (eslint 10).
  - no-useless-assignment - enabled (recommended rule).
  - no-debugger - enabled (recommended rule).
  - init-declarations - disabled (conflicts with no-useless-assignment).
  - perfectionist/sort-import-attributes - enabled (new rule).
  - perfectionist/sort-export-attributes - enabled (new rule).
  - @typescript-eslint/strict-void-return - enabled (new rule).
  - @typescript-eslint/no-useless-default-assignment - enabled (new rule).
  - @typescript-eslint/class-literal-property-style - changed config (getters
    are better for libraries).

## 2.5.0

- Added
  [eslint-config-flat-gitignore](https://github.com/antfu/eslint-config-flat-gitignore).

## 2.0.0

- Config [eslint-config-love](https://www.npmjs.com/package/eslint-config-love)
  has been removed. All its rules were revised anew.
- Plugin
  [eslint-plugin-eslint-comments](https://www.npmjs.com/package/eslint-plugin-eslint-comments)
  has been removed.
- Plugin
  [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
  replaced by
  [eslint-plugin-import-lite](https://www.npmjs.com/package/eslint-plugin-import-lite).
