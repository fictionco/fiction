import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import * as vite from "vite"
import type { RollupWatcher, RollupWatcherEvent } from "rollup"
import { deepMergeAll, getRequire } from "../utils"
import { FactorPlugin } from "../plugin"
import { CliOptions } from "../plugin-env"
import { PackageJson } from "../types"
import { getPackages, getCommit } from "./utils"
import { FactorBuild } from "."
export class FactorBundle extends FactorPlugin {
  factorBuild: FactorBuild
  bundlingTotal = 0
  bundlingCurrent = 0
  watchers: RollupWatcher[] = []
  constructor() {
    super({})
    this.factorBuild = new FactorBuild()
  }

  setup() {}

  bundleAll = async (options: CliOptions): Promise<void> => {
    const { mode = "production" } = options
    // If pkg is set, just bundle that one
    const packages = getPackages().filter((pkg) => pkg.buildOptions)
    const packageNames = packages.map((pkg) => pkg.name)
    if (packages.length === 0) {
      this.log.info(`no packages with buildOptions found`)
    } else {
      this.log.info(`bundling ${packages.length} packages`, {
        data: packageNames,
      })

      await this.bundlePackages({
        cwds: packages.map((pkg) => pkg.cwd).filter(Boolean) as string[],
        mode,
        watch: false,
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
    mode: "development" | "production"
    watch?: boolean
    onAllBuilt?: () => Promise<void> | void
    isTest?: boolean
  }): Promise<RollupWatcher[]> => {
    const { cwds, mode, onAllBuilt, watch, isTest } = options
    this.bundlingTotal = cwds.length
    this.bundlingCurrent = 0

    // setup async handling of first build
    let __resolve: ((w: RollupWatcher[]) => void) | undefined = undefined
    const finished = new Promise<RollupWatcher[]>(
      (resolve) => (__resolve = resolve),
    )

    this.watchers = []
    const _promises = cwds.map(async (cwd) => {
      const require = getRequire()
      const pkg = require(path.resolve(cwd, "./package.json")) as PackageJson
      const { name, main } = pkg
      const { entryFile, outputDir } = pkg.buildOptions

      const distDir = path.join("dist", outputDir || "")
      const outFileEntry = path.join(cwd, distDir, "index.js")

      // dont build again if is test
      if (isTest && fs.existsSync(outFileEntry)) {
        await this.onBuilt(onAllBuilt, __resolve)
        return
      }

      const w = await this.bundle({
        name,
        cwd,
        main,
        mode,
        outputDir,
        entryFile,
        watch,
        onBuilt: async () => this.onBuilt(onAllBuilt, __resolve),
      })

      if (w) this.watchers.push(w)
    })

    await Promise.all(_promises)

    return finished
  }

  doneBuilding = async (opts: {
    name: string
    mode: "production" | "development"
    entry: string
    distDir: string
    cwd: string
  }): Promise<void> => {
    const { name, mode, entry, distDir, cwd } = opts
    if (mode == "production") {
      /**
       * Create type declarations
       * https://tsup.egoist.sh/
       */
      this.log.info(`creating type definitions for ${name}`)
      await execa(
        "tsup",
        [entry, "--format", "esm", "--dts-only", "--out-dir", distDir],
        {
          stdio: "inherit",
          cwd,
        },
      )
    }

    this.log.info(`done building [${name}]`)
  }

  bundle = async (options: {
    name: string
    cwd?: string
    outputDir?: string
    entryFile?: string
    entryName?: string
    main?: string
    mode?: "production" | "development"
    commit?: string
    onBuilt?: (opts: {
      name: string
      event: RollupWatcherEvent
    }) => Promise<void> | void
    watch?: boolean
  }): Promise<RollupWatcher | undefined> => {
    const {
      name,
      cwd,
      main,
      mode = "production",
      outputDir,
      entryFile,
      onBuilt,
      watch,
    } = options

    try {
      if (!cwd) throw new Error("package root missing")

      this.log.info(`start bundle [${name}] in ${mode} mode`)

      let { commit } = options

      if (!commit) {
        commit = await getCommit()
      }

      const entry = entryFile || main || "index.ts"
      const distDir = path.join("dist", outputDir || "")
      const outDir = path.join(cwd, distDir)

      fs.removeSync(distDir)

      const vc = await this.factorBuild.getCommonViteConfig({
        cwd: cwd,
        mode,
      })
      const clientBuildOptions = deepMergeAll<vite.InlineConfig>([
        vc,
        {
          build: {
            outDir,
            emptyOutDir: true,
            lib: {
              formats: ["es"],
              entry,
              fileName: () => `index.js`,
            },
            watch: {},
          },
        },
      ])

      const watcher = (await vite.build(clientBuildOptions)) as RollupWatcher

      watcher.on("event", async (event: RollupWatcherEvent) => {
        if (event.code == "END") {
          await this.doneBuilding({
            name,
            mode,
            entry,
            distDir,
            cwd,
          })
          if (onBuilt) {
            await onBuilt({ name, event })
          }
          if (!watch) {
            await watcher.close()
          }
        } else if (event.code == "ERROR") {
          this.log.error(`error building ${name}`, { error: event.error })
        }
      })

      return watcher
    } catch (error) {
      this.log.error(`error building ${name}`, { error })
    }
  }
}
