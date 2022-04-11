import path from "path"
import { createRequire } from "module"
import glob from "glob"
import minimist, { ParsedArgs } from "minimist"
import Handlebars from "handlebars"
import fs from "fs-extra"
import { PackageJson } from "../types"

const require = createRequire(import.meta.url)
/**
 * Register a helper to print raw JS objects
 */
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context, null, 4)
})
/**
 * Checks whether the working directory has uncommitted changes
 */
export const isGitDirty = async (): Promise<boolean> => {
  const { execaCommandSync } = await import("execa")
  const { stdout } = execaCommandSync("git status --short")

  return stdout.length > 0 ? true : false
}
/**
 * Create a parsed file from it's template path and tracker config
 */
export const createFile = (
  templatePath: string,
  settings: Record<string, string> = {},
): string => {
  const html = fs.readFileSync(templatePath, "utf8")
  const template = Handlebars.compile(html)
  return template(settings)
}

/**
 * Get all workspace package names
 * Cache results to avoid unnecessary filesystem reads
 */

let __packageNames: PackageJson[] | undefined = undefined
export const getPackages = (
  options: { publicOnly?: boolean } = {},
): PackageJson[] => {
  if (!__packageNames) {
    __packageNames = []
    const { publicOnly } = options

    const root = path.resolve(process.cwd(), "package.json")
    const { workspaces = [] } = fs.readJsonSync(root) as PackageJson

    workspaces.forEach((w) => {
      const files = glob
        .sync(w)
        .map((f): PackageJson | undefined => {
          const cwd = process.cwd()
          const moduleRoot = path.resolve(cwd, f)
          const manifestPath = `${moduleRoot}/package.json`
          const exists = fs.existsSync(manifestPath)
          if (!fs.statSync(f).isDirectory() || !exists) return undefined
          else {
            const manifest = fs.readJsonSync(manifestPath) as PackageJson
            return !publicOnly || !manifest.private ? manifest : undefined
          }
        })
        .filter(Boolean) as PackageJson[]

      __packageNames = [...(__packageNames || []), ...files]
    })
  }

  return __packageNames
}
/**
 * Get last commit if we are in a git repository
 */
export const getCommit = async (length = 100): Promise<string> => {
  const { execaSync } = await import("execa")
  return fs.existsSync(`${process.cwd()}/.git`)
    ? execaSync("git", ["rev-parse", "HEAD"]).stdout.slice(0, length)
    : "no-repo"
}
/**
 * Get CLI args
 */
export const getArgs = (): ParsedArgs => {
  return minimist(process.argv.slice(2))
}
