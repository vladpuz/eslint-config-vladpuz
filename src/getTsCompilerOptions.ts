import { type CompilerOptions, findConfigFile, parseJsonConfigFileContent, readConfigFile, sys } from 'typescript'

/*
 * Source:
 * https://github.com/privatenumber/get-tsconfig?tab=readme-ov-file#how-can-i-use-typescript-to-parse-tsconfigjson
 */
export function getTsCompilerOptions(tsconfigRootDir: string): CompilerOptions {
  const tsconfigPath = findConfigFile(tsconfigRootDir, (fileName) => {
    return sys.fileExists(fileName)
  })

  if (tsconfigPath == null) {
    throw new Error('Project tsconfig not found')
  }

  const tsconfigFile = readConfigFile(tsconfigPath, (path) => {
    return sys.readFile(path)
  })

  const parsedTsconfig = parseJsonConfigFileContent(
    tsconfigFile.config,
    sys,
    tsconfigRootDir,
  )

  return parsedTsconfig.options
}
