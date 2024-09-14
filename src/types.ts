import type { TSESLint } from '@typescript-eslint/utils'

export interface Files {
  js?: string[]
  ts?: string[]
}

export interface Options {
  files?: Files
}

export type Config = TSESLint.FlatConfig.Config
