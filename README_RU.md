# eslint-config-vladpuz

> Мой ESLint конфиг

Особенности:

- Поддерживает JavaScript, TypeScript, смешанные кодовые базы и независимый от
  фреймворка JSX (чистая основа для использования с любым фреймворком!)
- Авто исправление для форматирования через
  [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
  (нацелен на использование без Prettier)
- Поддерживает `.gitignore` по умолчанию
- Не конфликтует с TypeScript при любых опциях tsconfig.json (TypeScript
  полностью заменяет некоторые правила)
- Возможность настроить собственные стилистические предпочтения
- Нет warn severity

Принципы:

- Безопасность
- Консистентность
- Минимальность для чтения
- Стабильность для diff

Если вам нужен React, используйте
[eslint-config-vladpuz-react](https://github.com/vladpuz/eslint-config-vladpuz-react).

## Установка

```shell
npm install --save-dev eslint eslint-config-vladpuz
```

## Использование

Создайте файл `eslint.config.js`:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz()
```

Если вы хотите использовать Prettier для форматирования других типов файлов
(json, md, html, css, ...), отключите Prettier для файлов JavaScript и
TypeScript. Для этого создайте файл `.prettierignore`:

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

Запуск ESLint в режиме проверки:

```shell
eslint .
```

Запуск ESLint в режиме исправления:

```shell
eslint --fix .
```

## Опции

Обзор:

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

Default for js: `FILES_JS`

Default for ts: `FILES_TS`

Переопределяют паттерны для js и ts файлов:

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

Переопределяет среды предоставляющие предопределенные глобальные переменные:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  env: ['node'], // For example only node
})
```

### gitignore

Type: `boolean | GitignoreOptions`

Default: `true`

Включает/отключает поддержку `.gitignore` или настраивает опции его поиска.

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

Включает/отключает TypeScript или настраивает опции его парсера.

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

### stylistic

Type: `boolean | StylisticOptions`

Default: `true`

Включает/отключает Stylistic или настраивает ваши собственные стилистические
предпочтения:

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

Включает/отключает JSX:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default vladpuz({
  jsx: false,
})
```

## Дополнительно

### errorify(target)

Преобразует severity правил `warn`/`1` в `error`/`2`.

- target (`Linter.Config[] | Linter.Config | Linter.RulesRecord`)

Return: `Linter.Config[] | Linter.Config | Linter.RulesRecord`

Предназначается для добавления сторонних конфигураций с сохранением общего стиля
severity (без warn):

```javascript
import vladpuz, { errorify } from 'eslint-config-vladpuz'
import x from 'eslint-plugin-x'

export default [...vladpuz(), errorify(x.configs.recommended)]
```

### getCompilerOptions(parserOptions?, force?)

Получает опции компилятора из tsconfig.json.

- parserOptions (`ParserOptions = {}`) - Опции парсера для поиска tsconfig.json.
- force (`boolean = false`) - Отключает кеш.

Return: `CompilerOptions`

Предназначается для динамического управления правилами в зависимости от опций
компилятора из tsconfig.json:

```javascript
import { getCompilerOptions } from 'eslint-config-vladpuz'

const compilerOptions = getCompilerOptions()

console.log(compilerOptions.strict)
console.log(compilerOptions.noEmit)
```

### testPluginConfig(pluginName, pluginRules, config)

Тестирует конфиг плагина через node:test.

- pluginName (`string | null`) - Название плагина.
- pluginRules (`Record<string, Rule.RuleModule>`) - Правила плагина.
- config (`Linter.Config`) - Тестируемый конфиг.

Return: `void`

Предназначается для тестирования конфигов плагинов внутри eslint-config-vladpuz
и расширенных конфигурациях (например
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

### Почему нет warn severity?

[ESLint Warnings Are an Anti-Pattern](https://dev.to/thawkin3/eslint-warnings-are-an-anti-pattern-33np)

### Где список правил?

[src/configs](https://github.com/vladpuz/eslint-config-vladpuz/tree/main/src/configs)

## Политика версионирования

Этот проект следует [Semantic Versioning](https://semver.org). Однако, поскольку
это всего лишь конфигурация, требующая мнений и множества изменяемых
компонентов, мы не считаем изменения правил критическими.

## Смотрите так же

- [prettier-config-vladpuz](https://github.com/vladpuz/prettier-config-vladpuz)
