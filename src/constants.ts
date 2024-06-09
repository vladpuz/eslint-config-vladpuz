import { GLOBS_JS, GLOBS_SRC, GLOBS_TS } from './globs.js'
import { type Files, type Options } from './types.js'

export const defaultFiles: Required<Files> = {
  js: GLOBS_JS,
  ts: GLOBS_TS,
  src: GLOBS_SRC,
}

export const defaultOptions: Required<Options> = {
  files: defaultFiles,
  perfectionistConfig: 'recommended-natural',
}
