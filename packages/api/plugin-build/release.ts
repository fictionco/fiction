import path from "path"
import fs from "fs"
import { createRequire } from "module"
import { ExecaChildProcess, ExecaError } from "execa"
import enquirer from "enquirer"
const { prompt } = enquirer
import semver, { ReleaseType } from "semver"
import { log } from "../logger"
import type { RunConfig } from "../cli/utils"
import { PackageJson } from "../types"
import { isGitDirty, getPackages } from "./utils"

const require = createRequire(import.meta.url)

/**
 * Semver release types
 */
const versionIncrements: ReleaseType[] = [
  "patch",
  "minor",
  "major",
  "prerelease",
]

const currentVersion = (): string => {
  const pkg = require(path.resolve(
    process.cwd(),
    "./package.json",
  )) as PackageJson
  return pkg.version
}

/**
 * Get possible version choices
 */
const versionChoices = (): string[] => {
  const choices = versionIncrements.map((i) => {
    const v = semver.inc(currentVersion(), i, "beta") ?? ""
    return `${i} (${v})`
  })
  return [...choices, "custom"]
}
/**
 * Run CLI command in child process
 */
const run = async (
  bin: string,
  args: string[],
  opts = {},
): Promise<ExecaChildProcess> => {
  const { execa } = await import("execa")
  return execa(bin, args, { stdio: "inherit", ...opts })
}
/**
 * Commit an action that is permanent in nature, taking into consideration
 * the dry run (--dry) option
 */
const commit = async (
  ...commandArgs: [string, string[], Record<string, string>?]
): Promise<void | ExecaChildProcess> => {
  const [bin, args, opts] = commandArgs
  return await run(bin, args, opts)
}

/**
 * Update the dependencies in manifest object
 */
const updateDeps = (
  name: string,
  type: string,
  deps: Record<string, string>,
  version: string,
): Record<string, string> => {
  const packages = getPackages()
  Object.keys(deps).forEach((dep) => {
    if (packages.map((_) => _.name).includes(dep)) {
      log.info("release", `${name} > ${type} > ${dep}@${version}`)
      deps[dep] = version
    }
  })
  return deps
}
/**
 * Update the version numbers for the module by dir
 */
const updatePackage = (moduleRoot?: string, version?: string): void => {
  if (!moduleRoot) throw new Error("moduleRoot is required")
  if (!version) throw new Error("version is required")

  const pkgPath = path.resolve(moduleRoot, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath).toString()) as PackageJson
  pkg.version = version

  const depType = ["dependencies", "devDependencies"]

  depType.map((t) => {
    const existing = pkg[t] as Record<string, string> | undefined
    if (existing) {
      pkg[t] = updateDeps(pkg.name, t, existing, version)
    }
  })

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
}
/**
 * Update all manifest version numbers
 */
const updateVersions = async (version: string): Promise<void> => {
  const workspaceRoot = path.resolve(process.cwd())
  updatePackage(workspaceRoot, version)
  getPackages().forEach((p) => {
    if (!p.moduleRoot) {
      log.error("updateVersions", `no moduleRoot`, { data: p })
    }
    updatePackage(p.moduleRoot, version)
  })
}
/**
 * Publish a module to NPM registry
 */
const publishPackage = async (
  pkg: PackageJson,
  version: string,
): Promise<void> => {
  if (pkg.private) {
    return
  }

  if (!pkg.moduleRoot) {
    throw new Error("moduleRoot is required")
  }

  const access = pkg.publishConfig?.access ?? "restricted"

  log.info("release", `publishing ${pkg.name}...`)
  try {
    await commit("npm", ["publish", "--access", access], {
      cwd: pkg.moduleRoot,
      stdio: "pipe",
    })

    log.info("release", `successfully published ${pkg.name}@${version}`)
  } catch (error: unknown) {
    const e = error as ExecaError
    if (/previously published/.test(e.stderr)) {
      log.info("release", `skipping already published: ${pkg.name}`)
    } else {
      throw e
    }
  }
}
/**
 * The main release routine controller
 */
export const releaseRoutine = async (options: RunConfig): Promise<void> => {
  const { patch, skipTests } = options

  log.info("release", `publish new version [live]`)
  log.info("release", `current version: ${currentVersion()}`)

  const dirty = await isGitDirty()
  if (dirty) {
    throw new Error("commit changes before publishing a release")
  }

  let targetVersion: string | undefined

  if (patch) {
    targetVersion = semver.inc(currentVersion(), "patch") as string
  }

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt<{ release: string }>({
      type: "select",
      name: "release",
      message: "Select release type",
      choices: versionChoices(),
    })

    if (release === "custom") {
      const { version } = await prompt<{ version: string }>({
        type: "input",
        name: "version",
        message: "Input custom version",
        initial: currentVersion(),
      })
      targetVersion = version
    } else {
      const v = release.match(/\((.*)\)/)
      targetVersion = v ? v[1] : undefined
    }
  }

  if (!targetVersion) {
    throw new Error("no target version")
  } else if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  if (!patch) {
    const { yes } = await prompt<{ yes: boolean }>({
      type: "confirm",
      name: "yes",
      message: `Releasing v${targetVersion}. Confirm?`,
    })

    if (!yes) return
  }

  // run tests before release
  log.info("release", `${skipTests ? "skipping" : "running"} tests...`)

  if (!skipTests) {
    await run("npm", ["run", "test"])
  }

  log.info("release", "updating cross dependencies...")
  await updateVersions(targetVersion)

  log.info("release", "building packages...")
  await run("npm", ["exec", "--", "factor", "bundle"])

  log.info("release", "generate changelog...")
  await run("npm", ["run", "changelog"])

  // commit version change
  const { stdout } = await run("git", ["diff"], { stdio: "pipe" })
  if (stdout) {
    log.log({
      level: "info",
      context: "release",
      description: "committing changes...",
    })
    await commit("git", ["add", "-A"])
    await commit("git", ["commit", "-m", `release: v${targetVersion}`])
  } else {
    log.log({
      level: "info",
      context: "release",
      description: "no changes to commit",
    })
  }

  // publish to npm
  log.log({
    level: "info",
    context: "release",
    description: "publishing packages...",
  })
  const publicPackages = getPackages({ publicOnly: true })

  for (const pkg of publicPackages) {
    await publishPackage(pkg, targetVersion)
  }

  log.info("release", "pushing to origin...")

  await commit("git", ["tag", `v${targetVersion}`])
  await commit("git", [
    "push",
    "--no-verify",
    "origin",
    `refs/tags/v${targetVersion}`,
  ])
  await commit("git", ["push", "--no-verify"])

  /**
   * Create a Github release
   * https://cli.github.com/manual/gh_release_create
   */
  // const { notes } = await prompt<{ notes: string }>({
  //   type: "input",
  //   name: "notes",
  //   message: "Create a github release? Add a description...",
  //   initial: "",
  // })

  // if (notes) {
  //   await commit("gh", ["release create", targetVersion, "--notes", notes])
  // }
}
