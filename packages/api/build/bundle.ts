import path from "path"
import { createRequire } from "module"
import fs from "fs-extra"
import { execa } from "execa"
import * as vite from "vite"
import { log } from "../logger"
import { PackageJson } from "../types"
import { deepMergeAll } from "../utils"
import { getViteConfig } from "../render/vite.config"
import { getPackages, getCommit } from "./utils"

const require = createRequire(import.meta.url)

export const packageDir = (packageName?: string): string => {
  if (!packageName) return ""

  return path.dirname(require.resolve(`${packageName}/package.json`))
}

interface BundleOptions {
  cwd?: string
  pkg?: PackageJson
  NODE_ENV?: "production" | "development"
  STAGE_ENV?: "prod" | "pre" | "local"
  commit?: string
  sourceMap?: boolean
  bundleMode?: "script" | "app"
}

export const outputFolders = (): {
  htmlFolder: string
  renderedFolder: string
} => {
  const dirname = new URL(".", import.meta.url).pathname
  return {
    htmlFolder: `${dirname}/html`,
    renderedFolder: `${dirname}/rendered`,
  }
}

/**
 * Run a child process for rollup that builds scripts based on options
 */
export const bundle = async (options: BundleOptions): Promise<void> => {
  const { pkg, NODE_ENV, bundleMode, STAGE_ENV = "prod" } = options

  try {
    if (!pkg) throw new Error("package data missing")
    if (!pkg.moduleRoot) throw new Error("package root missing")

    const buildOptions = pkg?.buildOptions ?? {}

    log.info("bundle", `start build ${pkg.name}`)

    let { commit } = options

    // pass in git commit via env var
    if (!commit && process.env.GIT_COMMIT) {
      commit = process.env.GIT_COMMIT
    } else if (!commit) {
      commit = await getCommit()
    }

    const vc = await getViteConfig(
      { mode: NODE_ENV },
      { variables: { STAGE_ENV } },
      { bundleMode },
    )

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
        logLevel: NODE_ENV == "production" ? "info" : "warn",
        plugins: [],
      },
    ])

    await vite.build(clientBuildOptions)

    if (NODE_ENV == "production") {
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

    log.info("bundle", `done building ${pkg.name}`)
  } catch (error) {
    log.error("bundle", `error building ${pkg?.name}`, { error })
  }
}

/**
 * Bundle all packages or just a specified one
 */
export const bundleAll = async (options: BundleOptions = {}): Promise<void> => {
  // If pkg is set, just bundle that one
  const packages = getPackages().filter((pkg) => pkg.buildOptions)
  if (packages.length === 0) {
    log.info("bundleAll", `no packages with buildOptions found`)
  } else {
    log.info("bundleAll", `bundling ${packages.length} packages`)
    // Outfile won't work in multi-build mode
    for (const pkg of packages) {
      if (pkg?.buildOptions) {
        await bundle({ ...options, pkg })
      }
    }
  }
}
