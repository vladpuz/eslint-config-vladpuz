## 3.2.0

- Updated eslint-plugin-unicorn to v64.
- Rules changes:
  - unicorn/no-negated-condition - disabled (conflicts with
    @typescript-eslint/strict-boolean-expressions).
  - unicorn/numeric-separators-style - changed config (onlyIfContainsSeparator).
  - unicorn/consistent-template-literal-escape - enabled (new rule).
  - unicorn/no-useless-iterator-to-array - enabled (new rule).
  - unicorn/prefer-simple-condition-first - enabled (new rule).
  - unicorn/switch-case-break-position - enabled (new rule).

## 3.1.0

- Added plugin
  [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn).
- Plugin [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
  has been removed. The only required rule from eslint-plugin-n is
  `prefer-node-protocol`, which is also present in eslint-plugin-unicorn, so
  eslint-plugin-n is no longer needed. The other rules aren't very useful.
- Changed default value of env option: added `builtin` preset.
- @typescript-eslint/no-unnecessary-condition - changed config (Allow
  `while (true) {...}`).
- Updated eslint-plugin-import-lite to `0.6.0`.
- Pin TypeScript 5 to peerDependencies.

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
