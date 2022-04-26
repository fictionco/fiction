import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import * as vite from "vite"
import { deepMergeAll } from "../utils"
import { RunConfig } from "../cli/utils"
import { FactorPlugin, UserConfig } from "../config"
import { getPackages, getCommit } from "./utils"
import { FactorBuild } from "."

/**
 * Bundle all packages or just a specified one
 */
type FactorBundleSettings = {
  factorBuild: FactorBuild
}
export class FactorBundle extends FactorPlugin<FactorBundleSettings> {
  factorBuild: FactorBuild
  constructor(settings: FactorBundleSettings) {
    super(settings)
    this.factorBuild = settings.factorBuild
  }

  setup(): UserConfig {
    return {
      hooks: [
        {
          hook: "runCommand",
          callback: async (runConfig: RunConfig) => {
            const { command } = runConfig

            if (command == "bundle") {
              await this.bundleAll(runConfig)
            }
          },
        },
      ],
    }
  }

  bundleAll = async (options: RunConfig): Promise<void> => {
    // If pkg is set, just bundle that one
    const packages = getPackages().filter((pkg) => pkg.buildOptions)
    if (packages.length === 0) {
      this.log.info(`no packages with buildOptions found`)
    } else {
      this.log.info(`bundling ${packages.length} packages`)
      // Outfile won't work in multi-build mode
      for (const pkg of packages) {
        if (pkg?.buildOptions) {
          await this.bundle({ ...options, pkg })
        }
      }
    }
  }

  bundle = async (runConfig: RunConfig): Promise<void> => {
    const { pkg, mode } = runConfig

    try {
      if (!pkg) throw new Error("package data missing")
      if (!pkg.moduleRoot) throw new Error("package root missing")

      const buildOptions = pkg?.buildOptions ?? {}

      this.log.info(`start build ${pkg.name}`)

      let { commit } = runConfig

      // pass in git commit via env var
      if (!commit && process.env.GIT_COMMIT) {
        commit = process.env.GIT_COMMIT
      } else if (!commit) {
        commit = await getCommit()
      }

      const vc = await this.factorBuild.getCommonViteConfig(runConfig)

      const distDir = path.join("dist", buildOptions.outputDir ?? "")

      const entry = buildOptions?.entryFile || pkg.main || "index.ts"
      const outDir = path.join(pkg.moduleRoot, distDir)

      fs.removeSync(distDir)

      const clientBuildOptions = deepMergeAll<vite.InlineConfig>([
        vc,
        {
          root: pkg.moduleRoot,
          build: {
            outDir,
            emptyOutDir: true,
            lib: {
              formats: ["es"],
              entry,
              name: buildOptions.entryName,
              fileName: () => `index.js`,
            },
          },
          logLevel: mode == "production" ? "info" : "warn",
          plugins: [],
        },
      ])

      await vite.build(clientBuildOptions)

      if (mode == "production") {
        /**
         * Create type declarations
         * https://tsup.egoist.sh/
         */
        await execa(
          "tsup",
          [entry, "--format", "esm", "--dts-only", "--out-dir", distDir],
          {
            stdio: "inherit",
            cwd: pkg.moduleRoot,
          },
        )
      }

      this.log.info(`done building ${pkg.name}`)
    } catch (error) {
      this.log.error(`error building ${pkg?.name}`, { error })
    }
  }
}
