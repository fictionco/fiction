import path from 'node:path'
import process from 'node:process'
import { glob } from 'glob'
import type { ParsedArgs } from 'minimist'
import minimist from 'minimist'
import Handlebars from 'handlebars'
import fs from 'fs-extra'
import type { PackageJson } from '../types/index.js'
import { getRequire } from '../utils/index.js'

/**
 * Checks whether the working directory has uncommitted changes
 */
export async function isGitDirty(): Promise<boolean> {
  const { execa } = await import('execa')
  const { stdout } = await execa`git status --short`

  return stdout.length > 0
}
/**
 * Create a parsed file from  it's template path and tracker config
 */
// export function createFile(templatePath: string, settings: Record<string, string> = {}): string {
//   /**
//    * Register a helper to print raw JS objects
//    */
//   Handlebars.registerHelper('json', context => JSON.stringify(context, null, 4))
//   const html = fs.readFileSync(templatePath, 'utf8')
//   const template = Handlebars.compile(html)
//   return template(settings)
// }
/**
 * Get all workspace package names
 * Cache results to avoid unnecessary filesystem reads
 */
let __packages: PackageJson[] | undefined
export function getPackages(options: { publicOnly?: boolean } = {}): PackageJson[] {
  if (!__packages) {
    __packages = []
    const { publicOnly } = options

    const root = path.resolve(process.cwd(), 'package.json')
    const { workspaces = [] } = fs.readJsonSync(root) as PackageJson

    workspaces.forEach((w) => {
      const files = glob
        .sync(w)
        .map((folder): PackageJson | undefined => {
          const cwd = process.cwd()
          const moduleRoot = path.resolve(cwd, folder)
          const manifestPath = `${moduleRoot}/package.json`
          const exists = fs.existsSync(manifestPath)
          if (fs.statSync(folder).isDirectory() && exists) {
            const manifest = getRequire()(manifestPath) as PackageJson
            manifest.cwd = moduleRoot
            return !publicOnly || !manifest.private ? manifest : undefined
          }
          else {
            return undefined
          }
        })
        .filter(Boolean) as PackageJson[]

      __packages = [...(__packages || []), ...files]
    })
  }

  return __packages
}
/**
 * Get last commit if we are in a git repository
 */
export async function getCommit(length = 100): Promise<string> {
  const { execa } = await import('execa')
  if (fs.existsSync(`${process.cwd()}/.git`)) {
    const { stdout } = await execa('git', ['rev-parse', 'HEAD'])

    return stdout.slice(0, length)
  }
  else {
    return 'no-repo'
  }
}
/**
 * Get CLI args
 */
export function getArgs(): ParsedArgs {
  return minimist(process.argv.slice(2))
}
