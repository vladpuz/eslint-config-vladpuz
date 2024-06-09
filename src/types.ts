import { type TSESLint } from '@typescript-eslint/utils'
import { type Linter } from 'eslint'

export interface Files {
  js?: string[]
  ts?: string[]
  src?: string[]
}

export interface Options {
  files?: Files
  perfectionistConfig?: string
}

export type Config = Linter.FlatConfig | TSESLint.FlatConfig.Config
