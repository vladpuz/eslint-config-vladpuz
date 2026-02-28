# eslint-config-vladpuz

> My ESLint config

Features:

- Supports JavaScript, TypeScript, mixed codebases and framework-agnostic JSX
  (pure base for use with any framework!)
- Auto fix for formatting via
  [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
  (targeted for use without Prettier)
- Does not conflict with TypeScript regardless of tsconfig.json options
  (TypeScript fully replaces some rules)
- Supports `.gitignore` by default
- Ability to customize your own stylistic preferences
- Does not use other pre-configured setups, all rules are manually reviewed
  (except stylistic, uses a custom preset)
- No warn severity, only error

Principles:

- Safety
- Consistency
- Minimal for readability
- Stability for diff

If you need React, use
[eslint-config-vladpuz-react](https://github.com/vladpuz/eslint-config-vladpuz-react).

## Installation

```shell
npm install --save-dev eslint eslint-config-vladpuz
```

## Usage

Create a file `eslint.config.js`:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz()
```

If you want to use Prettier for formatting other file types (json, md, html,
css, ...), disable Prettier for JavaScript and TypeScript files. For this,
create a file `.prettierignore`:

```ignore
# javascript
*.js
*.jsx
*.mjs
*.cjs

# typescript
*.ts
*.tsx
*.mts
*.cts
```

Run ESLint in check mode:

```shell
eslint .
```

Run ESLint in fix mode:

```shell
eslint --fix .
```

## Options

Overview:

```typescript
interface Options {
  filesJs?: string[] // Default - ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
  filesTs?: string[] // Default - ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']
  env?: Array<keyof typeof globals> // Default - ['node', 'browser']
  gitignore?: boolean | GitignoreOptions // Default - true
  typescript?: boolean | ParserOptions // Default - true
  stylistic?: boolean | StylisticOptions // Default - true
  jsx?: boolean // Default - true
}
```

### filesJs, filesTs

Type: `string[]`

Default for js: `['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']`

Default for ts: `['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']`

Override patterns for js and ts files:

```javascript
import vladpuz, { FILES_JS, FILES_TS } from 'eslint-config-vladpuz'

// For example any additional extensions
export default vladpuz({
  filesJs: [...FILES_JS, '**/*.extension'],
  filesTs: [...FILES_TS, '**/*.extension'],
})
```

### env

Type: `string[]`

Default: `['node', 'browser']`

Overrides environments providing predefined global variables:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  env: ['node'], // For example only node
})
```

### gitignore

Type: `boolean | GitignoreOptions`

Default: `true`

Enables/disables support for `.gitignore` or configures its search options.

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  // Default gitignore config is:
  gitignore: {
    strict: false,
  },
  // You can disable gitignore:
  // gitignore: false,
})
```

### typescript

Type: `boolean | ParserOptions`

Default: `true`

Enables/disables TypeScript or customizes its parser options.

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  // Default typescript config is:
  typescript: {
    projectService: true,
  },
  // You can disable typescript:
  // typescript: false,
})
```

### stylistic

Type: `boolean | StylisticOptions`

Default: `true`

Enables/disables Stylistic or configures your own stylistic preferences:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  // Default stylistic config is:
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  // You can disable stylistic:
  // stylistic: false,
})
```

### jsx

Type: `boolean`

Default: `true`

Enables/disables JSX:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  jsx: false,
})
```

## Additional

### errorify(target)

Converts severity of rules `warn`/`1` to `error`/`2`.

- target (`Linter.Config[] | Linter.Config | Linter.RulesRecord`)

Return: `Linter.Config[] | Linter.Config | Linter.RulesRecord`

Intended for adding external configs while preserving the overall severity style
(without warn):

```javascript
import vladpuz, { errorify } from 'eslint-config-vladpuz'
import x from 'eslint-plugin-x'

export default [...vladpuz(), errorify(x.configs.recommended)]
```

### getCompilerOptions(parserOptions?, force?)

Gets compiler options from tsconfig.json.

- parserOptions (`ParserOptions = {}`) - Parser options for searching
  tsconfig.json.
- force (`boolean = false`) - Disables cache.

Return: `CompilerOptions`

Intended for dynamic management of rules depending on compiler options from
tsconfig.json:

```javascript
import { getCompilerOptions } from 'eslint-config-vladpuz'

const compilerOptions = getCompilerOptions()

console.log(compilerOptions.strict)
console.log(compilerOptions.noEmit)
```

### testPluginConfig(pluginName, pluginRules, config)

Tests plugin config via node:test.

- pluginName (`string | null`) - Plugin name.
- pluginRules (`Record<string, Rule.RuleModule>`) - Plugin rules.
- config (`Linter.Config`) - Tested config.

Return: `void`

Intended for testing plugin configs inside eslint-config-vladpuz and extended
configs (e.g.
[eslint-config-vladpuz-react/src/configs.test.ts](https://github.com/vladpuz/eslint-config-vladpuz-react/tree/main/src/configs.test.ts)):

```javascript
import { testPluginConfig } from 'eslint-config-vladpuz'
import tseslint from 'typescript-eslint'

testPluginConfig('@typescript-eslint', tseslint.plugin.rules, {
  name: 'vladpuz/typescript',
  files: [],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {},
})
```

## FAQ

### Prettier?

[Why I don't use Prettier](https://antfu.me/posts/why-not-prettier)

### Why no warn severity?

[ESLint Warnings Are an Anti-Pattern](https://dev.to/thawkin3/eslint-warnings-are-an-anti-pattern-33np)

### Where is the list of rules?

[src/configs](https://github.com/vladpuz/eslint-config-vladpuz/tree/main/src/configs)

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org). However, since
this is just a configuration requiring opinions and many changeable components,
we don't consider rule changes critical.

## See Also

- [eslint-config-vladpuz-react](https://github.com/vladpuz/eslint-config-vladpuz-react)
- [prettier-config-vladpuz](https://github.com/vladpuz/prettier-config-vladpuz)
