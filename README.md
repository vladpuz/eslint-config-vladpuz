# eslint-config-vladpuz

> My ESLint config

Features:

- Supports JavaScript, TypeScript, mixed codebases and framework-agnostic JSX
  (pure base for use with any framework!)
- Auto fix for formatting via
  [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
  (targeted for use without Prettier)
- Doesn't conflict with TypeScript at any tsconfig.json options (TypeScript
  fully replaces some rules)
- Ability to customize your own stylistic preferences
- No warn severity

Principles:

- Safety
- Minimal for readability
- Stability for diff
- Consistency

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
  stylistic?: boolean | StylisticOptions // Default - true
  typescript?: boolean | ParserOptions // Default - true
  jsx?: boolean // Default - true
}
```

### filesJs, filesTs

Type: `string[]`

Default for js: `FILES_JS`

Default for ts: `FILES_TS`

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

### stylistic

Type: `boolean | StylisticOptions`

Default: `true`

Enables/disables Stylistic or customizes your own stylistic preferences:

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
    ecmaFeatures: {
      jsx: options.jsx,
    },
  },
  // You can disable typescript:
  // typescript: false,
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

## FAQ

### Prettier?

[Why I don't use Prettier](https://antfu.me/posts/why-not-prettier)

### Why no warn severity?

[ESLint Warnings Are an Anti-Pattern](https://dev.to/thawkin3/eslint-warnings-are-an-anti-pattern-33np)

### Where is the rule list?

[src/configs](https://github.com/vladpuz/eslint-config-vladpuz/tree/main/src/configs)

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org). However, since
this is just a configuration requiring opinions and many changeable components,
we don't consider rule changes critical.

## See also

- [prettier-config-vladpuz](https://github.com/vladpuz/prettier-config-vladpuz)
