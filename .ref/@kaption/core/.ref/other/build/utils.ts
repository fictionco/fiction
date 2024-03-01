import path from 'node:path'
import { createRequire } from 'node:module'
import { execaCommandSync, execaSync } from 'execa'
import type { ParsedArgs } from 'minimist'
import minimist from 'minimist'
import Handlebars from 'handlebars'
import fs from 'fs-extra'

const require = createRequire(import.meta.url)

/**
 * Register a helper to print raw JS objects
 */
Handlebars.registerHelper('json', (context) => {
  return JSON.stringify(context, null, 4)
})
/**
 * Checks whether the working directory has uncommitted changes
 */
export function isGitDirty(): boolean {
  const { stdout } = execaCommandSync('git status --short')

  return stdout.length > 0
}
/**
 * Create a parsed file from it's template path and tracker config
 */
export function createFile(templatePath: string, settings: Record<string, string> = {}): string {
  const html = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(html)
  return template(settings)
}
/**
 * Get the tracker base directory
 */
export function clientTagDir(): string {
  return path.dirname(require.resolve('@kaption/client-tag/package.json'))
}
/**
 * Get all workspace packages
 */
// export const getPackages = (
//   options: { publicOnly?: boolean } = {},
// ): string[] => {
//   let folders: string[] = []
//   const { publicOnly } = options

//   workspaces.forEach((w) => {
//     const files = glob
//       .sync(w)
//       .map((f): string => {
//         const manifestPath = path.join(process.cwd(), `${f}/package.json`)

//         const exists = fs.existsSync(manifestPath)
//         if (!fs.statSync(f).isDirectory() || !exists) {
//           return ""
//         } else {
//           const manifest = require(manifestPath) as PackageJson
//           return publicOnly && manifest.private ? "" : manifest.name
//         }
//       })
//       .filter(Boolean)

//     folders = [...folders, ...files]
//   })

//   return folders
// }
/**
 * Get last commit if we are in a git repository
 */
export function getCommit(length = 100): string {
  return fs.existsSync(`${process.cwd()}/.git`)
    ? execaSync('git', ['rev-parse', 'HEAD']).stdout.slice(0, length)
    : 'no-repo'
}
/**
 * Get CLI args
 */
export function getArgs(): ParsedArgs {
  return minimist(process.argv.slice(2))
}

export function getApiDomain(stage: 'local' | 'pre' | 'prod'): string {
  let apiDomain = 'localhost'
  if (stage === 'prod')
    apiDomain = 'kaption.net'

  return apiDomain
}

export function getTrackingScriptUrl(stage: 'local' | 'pre' | 'prod' = 'prod', projectId: string, localIp = 'localhost'): string {
  const PORT = process.env.PORT || 4000

  let url: string

  if (stage === 'local')
    url = `http://${localIp}:${PORT}/tag/index.js?id=${projectId}&k-engine`
  else
    url = `https://s.${getApiDomain(stage)}/${projectId}.js`

  return url
}
