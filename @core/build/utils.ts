import path from "path"
import { createRequire } from "module"
import glob from "glob"
import minimist, { ParsedArgs } from "minimist"
import Handlebars from "handlebars"
import fs from "fs-extra"
import { PackageJson } from "@factor/types"

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
 * Get all workspace packages
 */
export const getPackages = (
  options: { publicOnly?: boolean } = {},
): string[] => {
  let folders: string[] = []
  const { publicOnly } = options

  const root = path.resolve(process.cwd(), "package.json")
  const { workspaces = [] } = require(root) as PackageJson

  workspaces.forEach((w) => {
    const files = glob
      .sync(w)
      .map((f): string => {
        const manifestPath = path.resolve(process.cwd(), `${f}/package.json`)
        const exists = fs.existsSync(manifestPath)
        if (!fs.statSync(f).isDirectory() || !exists) return ""
        else {
          const manifest = require(manifestPath) as PackageJson
          return publicOnly && manifest.private ? "" : manifest.name
        }
      })
      .filter((_) => _)

    folders = [...folders, ...files]
  })

  return folders
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
