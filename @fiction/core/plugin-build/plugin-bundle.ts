/* server-only-file */
import path from 'node:path'
import fs from 'fs-extra'
import { execa } from 'execa'
import * as vite from 'vite'
import type { RollupWatcher, RollupWatcherEvent } from 'rollup'
import { deepMergeAll, getRequire, isNode, safeDirname } from '../utils'
import { FictionPlugin, type FictionPluginSettings } from '../plugin'
import type { CliOptions, FictionEnv } from '../plugin-env'
import type { PackageJson } from '../types'
import { getCommit, getPackages } from './utils'
import { FictionBuild } from '.'

type FictionBundleSettings = {
  fictionEnv: FictionEnv
} & FictionPluginSettings

type BuiltCallback = (opts: {
  packageName: string
  event?: RollupWatcherEvent
}) => Promise<void> | void
export class FictionBundle extends FictionPlugin<FictionBundleSettings> {
  fictionBuild: FictionBuild
  bundlingTotal = 0
  bundlingCurrent = 0
  watchers: RollupWatcher[] = []
  constructor(settings: FictionBundleSettings) {
    super('bundle', { root: safeDirname(import.meta.url), ...settings })
    this.fictionBuild = new FictionBuild({ fictionEnv: this.settings.fictionEnv })
  }

  bundleAll = async (
    options: CliOptions & { withDts?: boolean },
  ): Promise<void> => {
    const { withDts = false } = options

    // If pkg is set, just bundle that one
    const packages = getPackages().filter(pkg => pkg.buildOptions)
    const builds = packages.flatMap(pkg => pkg.buildOptions)
    const buildNames = builds.map(b => b?.buildName)
    if (packages.length === 0) {
      this.log.info(`no packages with "buildOptions" found`)
    }
    else {
      this.log.info(
        `creating ${builds.length} builds from ${packages.length} packages`,
        {
          data: buildNames,
        },
      )
      await this.bundlePackages({
        cwds: packages.map(pkg => pkg.cwd).filter(Boolean) as string[],
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
    if (this.bundlingCurrent === this.bundlingTotal) {
      this.bundlingCurrent = 0
      this.log.info(`bundling complete`)
      if (onAllBuilt) {
        await onAllBuilt()
        // allows for async handling of method
        if (__resolve)
          __resolve(this.watchers)
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
    if (!isNode())
      return []

    const { cwds, onAllBuilt, watch, isTest, withDts } = options
    this.bundlingTotal = cwds.length
    this.bundlingCurrent = 0

    // setup async handling of first build
    let __resolve: ((w: RollupWatcher[]) => void) | undefined
    const finished = new Promise<RollupWatcher[]>(
      resolve => (__resolve = resolve),
    )

    this.watchers = []
    const _promises = cwds.flatMap((cwd) => {
      const require = getRequire()
      const pkg = require(path.resolve(cwd, './package.json')) as PackageJson
      const { name: packageName } = pkg

      if (!pkg.buildOptions) {
        this.log.warn(
          `couldn't build: ${packageName} - no "buildOptions" found`,
        )
        return []
      }

      return pkg.buildOptions.map(async (build) => {
        const { buildName, entryFile, outputDir, configFile } = build

        const distDir = outputDir || 'dist'
        const outFileEntry = path.join(cwd, distDir, 'index.js')

        // dont build again if is test
        const exst = fs.existsSync(outFileEntry)

        if (isTest && exst) {
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

        if (w)
          this.watchers.push(w)
      })
    })

    await Promise.all(_promises)

    if (!watch)
      this.log.info(`done bundling ${this.bundlingTotal} packages`)

    return finished
  }

  doneBuilding = async (opts: {
    buildName: string
    packageName: string
    entry?: string
    distDir: string
    cwd: string
    withDts?: boolean
    onBuilt?: BuiltCallback
    watcherEvent?: RollupWatcherEvent
  }): Promise<void> => {
    const { packageName, entry, distDir, cwd, withDts, buildName, onBuilt, watcherEvent } = opts
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

      const c = command.split(' ')

      await execa(c[0], c.slice(1), { stdio: 'inherit', cwd })
    }

    if (onBuilt)
      await onBuilt({ packageName, event: watcherEvent })

    this.log.info(`done building [${packageName}:${buildName}]`)
  }

  bundle = async (options: {
    packageName: string
    cwd?: string
    outputDir?: string
    entryFile?: string
    buildName: string
    commit?: string
    onBuilt?: BuiltCallback
    watch?: boolean
    withDts?: boolean
    ssrEntry?: string
    subRoot?: string
    configFile?: string
  }): Promise<RollupWatcher | undefined> => {
    const { buildName, packageName, cwd, outputDir, entryFile, onBuilt, watch, withDts, configFile } = options

    try {
      if (!cwd)
        throw new Error('package root missing')

      this.log.info(`start bundle [${packageName}:${buildName}]`)

      let { commit } = options

      if (!commit)
        commit = await getCommit()

      const entry = entryFile
      const distDir = outputDir || 'dist'
      const outDir = path.join(cwd, distDir)
      const configFilePath = configFile ? path.join(cwd, configFile || '') : ''

      let addedConfig: vite.InlineConfig = {}
      if (configFilePath) {
        const { default: config } = (await import(
          /* @vite-ignore */ configFilePath
        )) as {
          default: (opts: { buildName: string, fictionBuild: FictionBuild }) => vite.InlineConfig
        }
        addedConfig = config({ buildName, fictionBuild: this.fictionBuild })
      }

      const vc = await this.fictionBuild.getFictionViteConfig({ root: cwd, mode: 'prod' })

      // library mode if entry is defined
      const lib: vite.LibraryOptions | undefined = entry
        ? { formats: ['es'], entry, fileName: () => `index.js` }
        : undefined

      const merge: vite.InlineConfig[] = [vc, { build: { outDir, lib } }, addedConfig]
      /**
       * Watching causes issues if it runs in CI due to the environment not having
       * the native watching libs
       */
      if (watch) {
        merge.push({ build: { watch: {} /* enables watcher */ } })

        const clientBuildOptions = deepMergeAll<vite.InlineConfig>(merge)

        const watcher = (await vite.build(
          clientBuildOptions,
        )) as unknown as RollupWatcher // rollup version mismatch

        watcher.on('event', async (event: RollupWatcherEvent) => {
          if (event.code === 'END') {
            await this.doneBuilding({ buildName, packageName, entry, distDir, cwd, withDts, onBuilt, watcherEvent: event })

            if (!watch)
              await watcher.close()
          }
          else if (event.code === 'ERROR') {
            this.log.error(`error building ${packageName}:${buildName}`, { error: event.error })
          }
        })

        return watcher
      }
      else {
        const clientBuildOptions = deepMergeAll<vite.InlineConfig>(merge)

        await vite.build(clientBuildOptions)

        await this.doneBuilding({ buildName, packageName, entry, distDir, cwd, withDts, onBuilt })
      }
    }
    catch (error) {
      this.log.error(`error building ${packageName}:${buildName}`, { error })
    }
  }
}
