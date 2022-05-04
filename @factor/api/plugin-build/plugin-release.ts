import path from "path"
import fs from "fs"
import { ExecaChildProcess, ExecaError } from "execa"
import enquirer from "enquirer"
import semver, { ReleaseType } from "semver"
import { CliOptions, FactorEnv } from "@factor/api/plugin-env"
import { log } from "@factor/api"
import { getRequire } from "@factor/api/utils"
import { PackageJson } from "@factor/api/types"
import { FactorPlugin } from "@factor/api/plugin"
import { isGitDirty, getPackages } from "./utils"

const { prompt } = enquirer

type FactorReleaseSettings = {
  factorEnv: FactorEnv<string>
}

export class FactorRelease extends FactorPlugin<FactorReleaseSettings> {
  versionIncrements: ReleaseType[] = ["patch", "minor", "major", "prerelease"]
  factorEnv: FactorEnv<string>
  constructor(settings: FactorReleaseSettings) {
    super(settings)
    this.factorEnv = settings.factorEnv

    this.addToCli()
  }

  setup() {
    return {}
  }

  addToCli() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: "runCommand",
        callback: async (command: string, opts: CliOptions) => {
          const { patch = false, skipTests = false } = opts

          if (command == "release") {
            await this.releaseRoutine({ patch, skipTests })
          }
        },
      })
    }
  }

  currentVersion = (): string => {
    const pkg = getRequire()(
      path.resolve(process.cwd(), "./package.json"),
    ) as PackageJson
    return pkg.version
  }

  versionChoices = (): string[] => {
    const choices = this.versionIncrements.map((i) => {
      const v = semver.inc(this.currentVersion(), i, "beta") ?? ""
      return `${i} (${v})`
    })
    return [...choices, "custom"]
  }

  run = async (
    bin: string,
    args: string[],
    opts = {},
  ): Promise<ExecaChildProcess> => {
    const { execa } = await import("execa")
    return execa(bin, args, { stdio: "inherit", ...opts })
  }

  commit = async (
    ...commandArgs: [string, string[], Record<string, string>?]
  ): Promise<void | ExecaChildProcess> => {
    const [bin, args, opts] = commandArgs
    return await this.run(bin, args, opts)
  }

  updateDeps = (
    name: string,
    type: string,
    deps: Record<string, string>,
    version: string,
  ): Record<string, string> => {
    const packages = getPackages()
    Object.keys(deps).forEach((dep) => {
      if (packages.map((_) => _.name).includes(dep)) {
        this.log.info(`${name} > ${type} > ${dep}@${version}`)
        deps[dep] = version
      }
    })
    return deps
  }

  updatePackage = (moduleRoot?: string, version?: string): void => {
    if (!moduleRoot) throw new Error("moduleRoot is required")
    if (!version) throw new Error("version is required")

    const pkgPath = path.resolve(moduleRoot, "package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath).toString()) as PackageJson
    pkg.version = version

    const depType = ["dependencies", "devDependencies"]

    depType.map((t) => {
      const existing = pkg[t] as Record<string, string> | undefined
      if (existing) {
        pkg[t] = this.updateDeps(pkg.name, t, existing, version)
      }
    })

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  }

  updateVersions = async (version: string): Promise<void> => {
    const workspaceRoot = path.resolve(process.cwd())
    this.updatePackage(workspaceRoot, version)
    getPackages().forEach((p) => {
      if (!p.moduleRoot) {
        log.error("updateVersions", `no moduleRoot`, { data: p })
      }
      this.updatePackage(p.moduleRoot, version)
    })
  }

  publishPackage = async (pkg: PackageJson, version: string): Promise<void> => {
    if (pkg.private) return
    if (!pkg.moduleRoot) throw new Error("moduleRoot is required")

    const access = pkg.publishConfig?.access ?? "restricted"

    this.log.info(`publishing ${pkg.name}...`)
    try {
      await this.commit("npm", ["publish", "--access", access], {
        cwd: pkg.moduleRoot,
        stdio: "pipe",
      })

      this.log.info(`successfully published ${pkg.name}@${version}`)
    } catch (error: unknown) {
      const e = error as ExecaError
      if (/previously published/.test(e.stderr)) {
        this.log.info(`skipping already published: ${pkg.name}`)
      } else {
        throw e
      }
    }
  }

  releaseRoutine = async (options?: {
    patch?: boolean
    skipTests?: boolean
  }): Promise<void> => {
    const { patch, skipTests } = options || {}

    this.log.info(`publish new version [live]`)
    this.log.info(`current version: ${this.currentVersion()}`)

    const dirty = await isGitDirty()
    if (dirty) {
      throw new Error("commit changes before publishing a release")
    }

    let targetVersion: string | undefined

    if (patch) {
      targetVersion = semver.inc(this.currentVersion(), "patch") as string
    }

    if (!targetVersion) {
      // no explicit version, offer suggestions
      const { release } = await prompt<{ release: string }>({
        type: "select",
        name: "release",
        message: "Select release type",
        choices: this.versionChoices(),
      })

      if (release === "custom") {
        const { version } = await prompt<{ version: string }>({
          type: "input",
          name: "version",
          message: "Input custom version",
          initial: this.currentVersion(),
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
    this.log.info(`${skipTests ? "skipping" : "running"} tests...`)

    if (!skipTests) {
      await this.run("npm", ["run", "test"])
    }

    this.log.info("updating cross dependencies...")
    await this.updateVersions(targetVersion)

    this.log.info("building packages...")
    await this.run("npm", ["exec", "--", "factor", "run", "bundle"])

    this.log.info("generate changelog...")
    await this.run("npm", ["run", "changelog"])

    // commit version change
    const { stdout } = await this.run("git", ["diff"], { stdio: "pipe" })
    if (stdout) {
      this.log.info("committing changes...")
      await this.commit("git", ["add", "-A"])
      await this.commit("git", ["commit", "-m", `release: v${targetVersion}`])
    } else {
      this.log.info("no changes to commit")
    }

    // publish to npm
    this.log.info("publishing packages...")
    const publicPackages = getPackages({ publicOnly: true })

    for (const pkg of publicPackages) {
      await this.publishPackage(pkg, targetVersion)
    }

    this.log.info("pushing to origin...")

    await this.commit("git", ["tag", `v${targetVersion}`])
    await this.commit("git", [
      "push",
      "--no-verify",
      "origin",
      `refs/tags/v${targetVersion}`,
    ])
    await this.commit("git", ["push", "--no-verify"])

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
}
