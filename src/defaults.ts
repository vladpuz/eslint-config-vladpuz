import type { Files, Options } from './types.js'

import { GLOBS_JS, GLOBS_TS } from './globs.js'

export const defaultFiles: Required<Files> = {
  js: GLOBS_JS,
  ts: GLOBS_TS,
}

export const defaultOptions: Required<Options> = {
  files: defaultFiles,
}
