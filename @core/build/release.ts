import path from "path"
import fs from "fs"
import execa from "execa"
import { prompt } from "enquirer"
import semver, { ReleaseType } from "semver"
import { nLog } from "@factor/server-utils"
import { version as currentVersion } from "../../package.json"
import { isGitDirty, getPackages } from "./utils"

let __dry: boolean | undefined

/**
 * Semver release types
 */
const versionIncrements: ReleaseType[] = [
  "prerelease",
  "patch",
  "minor",
  "major",
]

/**
 * Get possible version choices
 */
const versionChoices = (): string[] => {
  const choices = versionIncrements.map((i) => {
    return `${i} (${semver.inc(currentVersion, i, "beta")})`
  })
  return [...choices, "custom"]
}
/**
 * Run CLI command in child process
 */
const run = (
  bin: string,
  args: string[],
  opts = {},
): execa.ExecaChildProcess => {
  return execa(bin, args, { stdio: "inherit", ...opts })
}
/**
 * Commit an action that is permanent in nature, taking into consideration
 * the dry run (--dry) option
 */
const commit = (...commandArgs: any[]): void | execa.ExecaChildProcess => {
  const [bin, args, opts] = commandArgs
  //  Output CLI commands instead of actually run them
  if (__dry) {
    nLog("command", `(dry) ${bin} ${args.join(" ")}`)
  } else {
    return run(bin, args, opts)
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
      nLog("info", `${name} > ${type} > ${dep}@${version}`)
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
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
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
  updatePackage(path.resolve(__dirname, "../.."), version)
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

  nLog("info", `publishing ${moduleName}...`)
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

    nLog("success", `successfully published ${moduleName}@${version}`)
  } catch (error) {
    if (/previously published/.test(error.stderr)) {
      nLog("error", `skipping already published: ${moduleName}`)
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

  nLog("command", `publish new version [${dry ? "dry" : "live"}]`)
  nLog("info", "current version", { currentVersion })

  if (isGitDirty() && !dry && !commitChanges) {
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
  nLog("info", "running tests...")
  //await run("yarn", ["test-lint"])

  // update all package versions and inter-dependencies
  nLog("info", "updating cross dependencies...")
  updateVersions(targetVersion)

  // build with rollup
  nLog("info", "building packages...")
  await run("yarn", ["factor", "bundle"])

  // generate changelog
  nLog("info", "generate changelog...")
  await run(`yarn`, ["changelog"])

  // commit version change
  const { stdout } = await run("git", ["diff"], { stdio: "pipe" })
  if (stdout) {
    nLog("info", "committing changes...")
    await commit("git", ["add", "-A"])
    await commit("git", ["commit", "-m", `release: v${targetVersion}`])
  } else {
    nLog("info", "no changes to commit")
  }

  // publish to npm
  nLog("info", "publishing packages...")
  for (const moduleName of getPackages({ publicOnly: true })) {
    await publishPackage(moduleName, targetVersion)
  }

  // push to github
  nLog("info", "pushing to github...")
  await commit("git", ["tag", `v${targetVersion}`])
  await commit("git", [
    "push",
    "--no-verify",
    "origin",
    `refs/tags/v${targetVersion}`,
  ])
  await commit("git", ["push", "--no-verify"])

  if (dry) {
    nLog(`info`, `dry run finished - run git diff to see package changes.`)
  }
}
