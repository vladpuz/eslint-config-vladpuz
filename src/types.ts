import type { TSESLint } from '@typescript-eslint/utils'
import type { Linter } from 'eslint'

export interface Files {
  js?: string[]
  ts?: string[]
}

export interface Options {
  files?: Files
}

export type Config = Linter.FlatConfig | TSESLint.FlatConfig.Config
