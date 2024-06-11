import path from 'node:path'
import process from 'node:process'
import type { PackageJson } from '../types/index.js'
import { log } from '../plugin-log/index.js'
import { requireIfExists } from '../utils/index.js'

export function done(code: 0 | 1, message = `exited process`): never {
  if (message)
    log.info('CLI', `done: ${message} (${code})`)

  process.exit(code)
}

export function packageMainFile(cwd: string): string {
  const pkgPath = path.resolve(cwd, 'package.json')
  const pkg: PackageJson | undefined = requireIfExists(pkgPath)
  return pkg?.main ?? 'index'
}
