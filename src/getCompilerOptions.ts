import type { ParserOptions } from '@typescript-eslint/types'

import { type CompilerOptions, findConfigFile, parseJsonConfigFileContent, readConfigFile, sys } from 'typescript'

const cache = new Map<string, CompilerOptions>()

/*
 * Source:
 * https://github.com/privatenumber/get-tsconfig?tab=readme-ov-file#how-can-i-use-typescript-to-parse-tsconfigjson
 */
export function getCompilerOptions(
  parserOptions: ParserOptions = {},
  force = false,
): CompilerOptions {
  const searchPath = parserOptions.tsconfigRootDir ?? process.cwd()
  const configName = (typeof parserOptions.projectService === 'object')
    ? parserOptions.projectService.defaultProject ?? 'tsconfig.json'
    : 'tsconfig.json'

  const cacheKey = `${searchPath}:${configName}`

  if (!force) {
    const compilerOptions = cache.get(cacheKey)

    if (compilerOptions) {
      return compilerOptions
    }
  }

  const tsconfigPath = findConfigFile(
    searchPath,
    (fileName) => {
      return sys.fileExists(fileName)
    },
    configName,
  )

  if (tsconfigPath == null) {
    throw new Error(`Config file "${configName}" not found in "${searchPath}"`)
  }

  const tsconfigFile = readConfigFile(
    tsconfigPath,
    (path) => {
      return sys.readFile(path)
    },
  )

  const parsedTsconfig = parseJsonConfigFileContent(
    tsconfigFile.config,
    sys,
    searchPath,
  )

  cache.set(cacheKey, parsedTsconfig.options)
  return parsedTsconfig.options
}
