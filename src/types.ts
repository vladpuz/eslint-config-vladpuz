import type { TSESLint } from '@typescript-eslint/utils'
import type { Linter } from 'eslint'

export type Config = Linter.Config | TSESLint.FlatConfig.Config
