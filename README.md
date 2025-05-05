# eslint-config-vladpuz

> Моя конфигурация eslint

Особенности:

- Поддерживает javascript, typescript и независимый от фреймворка jsx (чистая
  основа для использования с любым фреймворком)
- Автоматическое форматирование исходного кода через
  [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
  (нацелен на использование без prettier)
- Базируется на конфигурации
  [eslint-config-love](https://github.com/mightyiam/eslint-config-love)
- Сортировка импортов и экспортов через
  [eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist)

## Установка

```shell
npm install --save-dev eslint eslint-config-vladpuz
```

## Использование

Создайте файл `eslint.config.js`:

```javascript
import vladpuz from 'eslint-config-vladpuz'

export default [...vladpuz()]
```

Если вы хотите использовать prettier для форматирования файлов не содержащих
исходный код (json, md, html), отключите prettier для файлов javascript и
typescript. Для этого создайте файл `.prettierignore`:

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

Запуск eslint в режиме проверки:

```shell
eslint .
```

Запуск eslint в режиме исправления:

```shell
eslint --fix .
```

## Опции конфигурации

- `filesJs`, `filesTs` - переопределить или добавить паттерны для js и ts.
  Например, можно добавить любое расширение файла:

```javascript
import vladpuz, { GLOBS_JS, GLOBS_TS } from 'eslint-config-vladpuz'

export default [
  ...vladpuz({
    filesJs: [...GLOBS_JS, '*.EXTJS'],
    filesTs: [...GLOBS_TS, '*.EXTTS'],
  }),
]
```

## Смотрите так же

- [prettier-config-vladpuz](https://github.com/vladpuz/prettier-config-vladpuz)
