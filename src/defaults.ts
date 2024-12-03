import type { Options } from './types.js'

import { GLOBS_JS, GLOBS_TS } from './globs.js'

export const defaultOptions: Required<Options> = {
  filesJs: GLOBS_JS,
  filesTs: GLOBS_TS,
}
