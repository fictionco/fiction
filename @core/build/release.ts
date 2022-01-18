import path from "path"
import fs from "fs"
import { ExecaChildProcess } from "execa"
import enquirer from "enquirer"
const { prompt } = enquirer
import semver, { ReleaseType } from "semver"
import { logger } from "@factor/server-utils"
import { version as currentVersion } from "../../package.json"
import { isGitDirty, getPackages } from "./utils"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
let __dry: boolean | undefined

/**
 * Semver release types
 */
const versionIncrements: ReleaseType[] = [
  "patch",
  "minor",
  "major",
  "prerelease",
]

/**
 * Get possible version choices
 */
const versionChoices = (): string[] => {
  const choices = versionIncrements.map((i) => {
    const v = semver.inc(currentVersion, i, "beta") ?? ""
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
  ...commandArgs: any[]
): Promise<void | ExecaChildProcess> => {
  const [bin, args, opts] = commandArgs
  //  Output CLI commands instead of actually run them
  if (__dry) {
    logger({
      level: "info",
      context: "release",
      description: `(dry) ${bin} ${args.join(" ")}`,
    })
  } else {
    return await run(bin, args, opts)
  }
}
/**
 * Get the directory of a module given it's name
 */
const getModuleDirectory = (moduleName: string): string => {
  return path.dirname(require.resolve(`${moduleName}/package.json`))
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
  Object.keys(deps).forEach((dep) => {
    if (getPackages().includes(dep)) {
      logger({
        level: "info",
        context: "release",
        description: `${name} > ${type} > ${dep}@${version}`,
      })
      deps[dep] = version
    }
  })
  return deps
}
/**
 * Update the version numbers for the module by dir
 */
const updatePackage = (pkgRoot: string, version: string): void => {
  const pkgPath = path.resolve(pkgRoot, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath))
  pkg.version = version

  const depType = ["dependencies", "peerDependencies", "devDependencies"]

  depType.forEach((t) => {
    const existing = pkg[t]
    if (existing) {
      pkg[t] = updateDeps(pkg.name, t, existing, version)
    }
  })

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
}
/**
 * Update all manifest version numbers
 */
const updateVersions = (version: string): void => {
  // update root package.json
  const dirname = new URL(".", import.meta.url).pathname
  updatePackage(path.resolve(dirname, "../.."), version)
  // update the workspace modules
  getPackages().forEach((p) => updatePackage(getModuleDirectory(p), version))
}
/**
 * Publish a module to NPM registry
 */
const publishPackage = async (
  moduleName: string,
  version: string,
): Promise<void> => {
  const pkgRoot = getModuleDirectory(moduleName)
  const pkg = require(`${moduleName}/package.json`)

  if (pkg.private) {
    return
  }

  const access = pkg.publishConfig?.access ?? "restricted"

  // Add a special tag for the package?
  const releaseTag = null

  logger({
    level: "info",
    context: "release",
    description: `publishing ${moduleName}...`,
  })
  try {
    await commit(
      "yarn",
      [
        "publish",
        "--new-version",
        version,
        ...(releaseTag ? ["--tag", releaseTag] : []),
        "--access",
        access,
      ],
      {
        cwd: pkgRoot,
        stdio: "pipe",
      },
    )

    logger({
      level: "info",
      context: "release",
      description: `successfully published ${moduleName}@${version}`,
    })
  } catch (error: any) {
    if (/previously published/.test(error.stderr)) {
      logger({
        level: "warn",
        context: "release",
        description: `skipping already published: ${moduleName}`,
      })
    } else {
      throw error
    }
  }
}
/**
 * The main release routine controller
 */
export const releaseRoutine = async (
  options: {
    dry?: boolean
    patch?: boolean
    commitChanges?: boolean
  } = {},
): Promise<void> => {
  const { dry, patch, commitChanges } = options
  __dry = dry

  logger({
    level: "info",
    context: "release",
    description: `publish new version [${dry ? "dry" : "live"}]`,
  })
  logger({
    level: "info",
    context: "release",
    description: `current version: ${currentVersion}`,
  })

  const dirty = await isGitDirty()
  if (dirty && !dry && !commitChanges) {
    throw new Error("commit changes before publishing a release")
  }

  let targetVersion: string | undefined

  if (patch) {
    targetVersion = semver.inc(currentVersion, "patch") as string
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
        initial: currentVersion,
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
  logger({
    level: "info",
    context: "release",
    description: "running tests...",
  })
  //await run("yarn", ["test-lint"])

  // update all package versions and inter-dependencies

  logger({
    level: "info",
    context: "release",
    description: "updating cross dependencies...",
  })
  updateVersions(targetVersion)

  // build with rollup

  logger({
    level: "info",
    context: "release",
    description: "building packages...",
  })
  await run("yarn", ["factor", "bundle"])

  // generate changelog

  logger({
    level: "info",
    context: "release",
    description: "generate changelog...",
  })
  await run(`yarn`, ["changelog"])

  // commit version change
  const { stdout } = await run("git", ["diff"], { stdio: "pipe" })
  if (stdout) {
    logger({
      level: "info",
      context: "release",
      description: "committing changes...",
    })
    await commit("git", ["add", "-A"])
    await commit("git", ["commit", "-m", `release: v${targetVersion}`])
  } else {
    logger({
      level: "info",
      context: "release",
      description: "no changes to commit",
    })
  }

  // publish to npm
  logger({
    level: "info",
    context: "release",
    description: "publishing packages...",
  })
  for (const moduleName of getPackages({ publicOnly: true })) {
    await publishPackage(moduleName, targetVersion)
  }

  // push to github
  logger({
    level: "info",
    context: "release",
    description: "pushing to origin...",
  })
  await commit("git", ["tag", `v${targetVersion}`])
  await commit("git", [
    "push",
    "--no-verify",
    "origin",
    `refs/tags/v${targetVersion}`,
  ])
  await commit("git", ["push", "--no-verify"])

  if (dry) {
    logger({
      level: "info",
      context: "release",
      description: `dry run finished - run git diff to see package changes.`,
    })
  }

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
