declare module 'eslint-plugin-*' {
  import type { Linter } from 'eslint'
  const plugin: Linter.Plugin
  export = plugin
}
