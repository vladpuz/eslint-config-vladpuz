import { GLOBS_JS, GLOBS_TS } from './globs.js'
import { type Files, type Options } from './types.js'

export const defaultFiles: Required<Files> = {
  js: GLOBS_JS,
  ts: GLOBS_TS,
}

export const defaultOptions: Required<Options> = {
  files: defaultFiles,
}
