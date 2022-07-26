import path from "path"
import fs from "fs-extra"
import { execaCommand } from "execa"
import * as vite from "vite"
import type { RollupWatcher, RollupWatcherEvent } from "rollup"
import { deepMergeAll, getRequire } from "../utils"
import { FactorPlugin } from "../plugin"
import { CliOptions, FactorEnv } from "../plugin-env"
import { PackageJson } from "../types"
import { getPackages, getCommit } from "./utils"
import { FactorBuild } from "."

type FactorBundleSettings = {
  factorEnv: FactorEnv
}
export class FactorBundle extends FactorPlugin<FactorBundleSettings> {
  factorBuild: FactorBuild
  factorEnv = this.settings.factorEnv
  bundlingTotal = 0
  bundlingCurrent = 0
  watchers: RollupWatcher[] = []
  constructor(settings: FactorBundleSettings) {
    super(settings)
    this.factorBuild = new FactorBuild({ factorEnv: this.factorEnv })
  }

  setup() {}

  bundleAll = async (
    options: CliOptions & { withDts?: boolean },
  ): Promise<void> => {
    const { withDts = false } = options

    // If pkg is set, just bundle that one
    const packages = getPackages().filter((pkg) => pkg.buildOptions)
    const builds = packages.flatMap((pkg) => pkg.buildOptions)
    const buildNames = builds.map((b) => b.buildName)
    if (packages.length === 0) {
      this.log.info(`no packages with "buildOptions" found`)
    } else {
      this.log.info(
        `creating ${builds.length} builds from ${packages.length} packages`,
        {
          data: buildNames,
        },
      )

      await this.bundlePackages({
        cwds: packages.map((pkg) => pkg.cwd).filter(Boolean) as string[],
        watch: false,
        withDts,
      })
    }
  }

  async onBuilt(
    onAllBuilt?: () => Promise<void> | void,
    __resolve?: (w: RollupWatcher[]) => void,
  ) {
    this.bundlingCurrent++

    if (this.bundlingCurrent == this.bundlingTotal) {
      this.bundlingCurrent = 0
      this.log.info(`bundling complete`)
      if (onAllBuilt) {
        await onAllBuilt()
        // allows for async handling of method
        if (__resolve) __resolve(this.watchers)
      }
    }
  }

  bundlePackages = async (options: {
    cwds: string[]
    watch?: boolean
    onAllBuilt?: () => Promise<void> | void
    isTest?: boolean
    withDts?: boolean
  }): Promise<RollupWatcher[]> => {
    if (!this.utils.isNode()) return []

    const { cwds, onAllBuilt, watch, isTest, withDts } = options
    this.bundlingTotal = cwds.length
    this.bundlingCurrent = 0

    // setup async handling of first build
    let __resolve: ((w: RollupWatcher[]) => void) | undefined = undefined
    const finished = new Promise<RollupWatcher[]>(
      (resolve) => (__resolve = resolve),
    )

    this.watchers = []
    const _promises = cwds.flatMap((cwd) => {
      const require = getRequire()
      const pkg = require(path.resolve(cwd, "./package.json")) as PackageJson
      const { name: packageName } = pkg

      return pkg.buildOptions.map(async (build) => {
        const { buildName, entryFile, outputDir, configFile } = build

        const distDir = outputDir || "dist"
        const outFileEntry = path.join(cwd, distDir, "index.js")

        // dont build again if is test
        if (isTest && fs.existsSync(outFileEntry)) {
          await this.onBuilt(onAllBuilt, __resolve)
          return
        }

        const w = await this.bundle({
          packageName,
          buildName,
          cwd,
          outputDir,
          entryFile,
          watch,
          withDts,
          configFile,
          onBuilt: async () => this.onBuilt(onAllBuilt, __resolve),
        })

        if (w) this.watchers.push(w)
      })
    })

    await Promise.all(_promises)

    return finished
  }

  doneBuilding = async (opts: {
    packageName: string
    entry?: string
    distDir: string
    cwd: string
    withDts?: boolean
  }): Promise<void> => {
    const { packageName, entry, distDir, cwd, withDts } = opts
    if (withDts && entry) {
      /**
       * Create type declarations
       * https://tsup.egoist.sh/
       * NOTES
       *  - for "rootDir" errors not containing code, the issue is using relative imports
       *    when module name imports should be used.
       *  - for "inferred type" errors, likely a direct import of the referred module fixes (TS4.8 may fix this)
       */

      const command = `tsup ${entry} --format esm --dts-only --out-dir ${distDir}`
      this.log.info(`creating type definitions for ${packageName}`, {
        data: command,
      })
      await execaCommand(command, {
        stdio: "inherit",
        cwd,
      })
    }

    this.log.info(`done building [${packageName}]`)
  }

  bundle = async (options: {
    packageName: string
    cwd?: string
    outputDir?: string
    entryFile?: string
    buildName: string
    mode?: "production" | "development"
    commit?: string
    onBuilt?: (opts: {
      packageName: string
      event: RollupWatcherEvent
    }) => Promise<void> | void
    watch?: boolean
    withDts?: boolean
    ssrEntry?: string
    subRoot?: string
    configFile?: string
  }): Promise<RollupWatcher | undefined> => {
    const {
      buildName,
      packageName,
      cwd,
      mode = "production",
      outputDir,
      entryFile,
      onBuilt,
      watch,
      withDts,
      configFile,
    } = options

    try {
      if (!cwd) throw new Error("package root missing")

      this.log.info(
        `start bundle [${packageName}:${buildName}] in ${mode} mode`,
      )

      let { commit } = options

      if (!commit) {
        commit = await getCommit()
      }

      const entry = entryFile
      const distDir = outputDir || "dist"
      const outDir = path.join(cwd, distDir)
      const configFilePath = configFile ? path.join(cwd, configFile || "") : ""

      let addedConfig: vite.InlineConfig = {}
      if (configFilePath) {
        const { default: config } = (await import(configFilePath)) as {
          default: (opts: { buildName: string }) => vite.InlineConfig
        }
        addedConfig = config({ buildName })
      }

      const vc = await this.factorBuild.getCommonViteConfig({
        root: cwd,
        mode,
      })

      // library mode if entry is defined
      const lib: vite.LibraryOptions | undefined = entry
        ? {
            formats: ["es"],
            entry,
            fileName: () => `index.js`,
          }
        : undefined

      const merge: vite.InlineConfig[] = [
        vc,
        {
          build: {
            outDir,
            lib,
          },
        },
        addedConfig,
      ]

      /**
       * Watching causes issues if it runs in CI due to the environment not having
       * the native watching libs
       */
      if (watch) {
        merge.push({ build: { watch: {} /* enables watcher */ } })

        const clientBuildOptions = deepMergeAll<vite.InlineConfig>(merge)

        const watcher = (await vite.build(clientBuildOptions)) as RollupWatcher

        watcher.on("event", async (event: RollupWatcherEvent) => {
          if (event.code == "END") {
            await this.doneBuilding({
              packageName,
              entry,
              distDir,
              cwd,
              withDts,
            })
            if (onBuilt) await onBuilt({ packageName, event })

            if (!watch) {
              await watcher.close()
            }
          } else if (event.code == "ERROR") {
            this.log.error(`error building ${packageName}`, {
              error: event.error,
            })
          }
        })

        return watcher
      } else {
        const clientBuildOptions = deepMergeAll<vite.InlineConfig>(merge)

        await vite.build(clientBuildOptions)

        await this.doneBuilding({
          packageName,
          entry,
          distDir,
          cwd,
          withDts,
        })

        return
      }
    } catch (error) {
      this.log.error(`error building ${packageName}`, { error })
    }
  }
}
