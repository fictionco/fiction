import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import * as vite from "vite"
import { deepMergeAll, getRequire } from "../utils"
import { FactorPlugin } from "../plugin"
import { CliOptions } from "../plugin-env"
import { PackageJson } from "../types"
import { getPackages, getCommit } from "./utils"
import { FactorBuild } from "."

export class FactorBundle extends FactorPlugin {
  factorBuild: FactorBuild

  constructor() {
    super({})
    this.factorBuild = new FactorBuild()
  }

  setup() {}

  bundleAll = async (options: CliOptions): Promise<void> => {
    const { mode } = options
    // If pkg is set, just bundle that one
    const packages = getPackages().filter((pkg) => pkg.buildOptions)
    const packageNames = packages.map((pkg) => pkg.name)
    if (packages.length === 0) {
      this.log.info(`no packages with buildOptions found`)
    } else {
      this.log.info(`bundling ${packages.length} packages`, {
        data: packageNames,
      })
      // Outfile won't work in multi-build mode
      for (const pkg of packages) {
        if (pkg?.buildOptions) {
          const { name, moduleRoot, main } = pkg
          const { outputDir, entryFile } = pkg.buildOptions
          await this.bundle({
            name,
            moduleRoot,
            main,
            mode,
            outputDir,
            entryFile,
          })
        }
      }
    }
  }

  bundlePackages = async (options: {
    moduleRoots: string[]
    mode: "development" | "production"
  }): Promise<void> => {
    const { moduleRoots, mode } = options
    for (const moduleRoot of moduleRoots) {
      const pkg = getRequire()(
        path.resolve(moduleRoot, "./package.json"),
      ) as PackageJson
      const { name, main } = pkg
      const { outputDir, entryFile } = pkg.buildOptions
      await this.bundle({
        name,
        moduleRoot,
        main,
        mode,
        outputDir,
        entryFile,
      })
    }
  }

  bundle = async (options: {
    name: string
    moduleRoot?: string
    outputDir?: string
    entryFile?: string
    entryName?: string
    main?: string
    mode?: "production" | "development"
    commit?: string
  }): Promise<void> => {
    const {
      name,
      moduleRoot,
      main,
      mode = "production",
      outputDir,
      entryFile,
    } = options

    try {
      if (!moduleRoot) throw new Error("package root missing")

      this.log.info(`start bundle [${name}] in ${mode} mode`)

      let { commit } = options

      if (!commit) {
        commit = await getCommit()
      }

      const entry = entryFile || main || "index.ts"
      const distDir = path.join("dist", outputDir || "")
      const outDir = path.join(moduleRoot, distDir)

      fs.removeSync(distDir)

      const vc = await this.factorBuild.getCommonViteConfig({
        cwd: moduleRoot,
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
          },
        },
      ])

      await vite.build(clientBuildOptions)

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
            cwd: moduleRoot,
          },
        )
      }

      this.log.info(`done building [${name}]\n\n`)
    } catch (error) {
      this.log.error(`error building ${name}`, { error })
    }
  }
}
