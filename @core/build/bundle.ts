import path from "path"
import { createRequire } from "module"
import fs from "fs-extra"
import { logger, PackageJson, deepMergeAll } from "@factor/api"
import { execa } from "execa"
import * as vite from "vite"
import { getViteConfig } from "@factor/render/vite.config"
import { getPackages, getCommit } from "./utils"

const require = createRequire(import.meta.url)

export const packageDir = (packageName?: string): string => {
  if (!packageName) return ""

  return path.dirname(require.resolve(`${packageName}/package.json`))
}

interface BundleOptions {
  cwd?: string
  packageName?: string
  NODE_ENV?: "production" | "development"
  STAGE_ENV?: "prod" | "pre" | "local"
  commit?: string
  sourceMap?: boolean
  bundleType?: "script" | "app"
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

const getPkg = async (pkg: string): Promise<PackageJson | undefined> => {
  return (await import(`${pkg}/package.json`)) as PackageJson
}

/**
 * Run a child process for rollup that builds scripts based on options
 */
export const bundle = async (options: BundleOptions): Promise<void> => {
  const { packageName, cwd, NODE_ENV, bundleType, STAGE_ENV = "prod" } = options
  try {
    if (!packageName && !cwd) throw new Error("no pkg name available")

    const _cwd = cwd ? cwd : packageDir(packageName)

    const pkg = await getPkg(_cwd)
    const buildOptions = pkg?.buildOptions ?? {}

    logger.log({
      level: "info",
      description: `bundling ${pkg?.name}`,
      context: "build:bundle",
    })

    let { commit } = options

    fs.removeSync(`${cwd}/dist`)

    // pass in git commit via env var
    if (!commit && process.env.GIT_COMMIT) {
      commit = process.env.GIT_COMMIT
    } else if (!commit) {
      commit = await getCommit()
    }

    const vc = await getViteConfig(
      { mode: NODE_ENV },
      { bundleType, variables: { STAGE_ENV } },
    )

    if (!buildOptions?.entryFile) throw new Error("no entry file")

    const clientBuildOptions = deepMergeAll<vite.InlineConfig>([
      vc,
      {
        root: _cwd,
        build: {
          outDir: path.join(_cwd, "/dist", buildOptions.outputDir ?? ""),
          emptyOutDir: true,
          lib: {
            formats: ["es"],
            entry: buildOptions?.entryFile,
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
        [
          buildOptions?.entryFile,
          "--format",
          "esm",
          "--dts-only",
          "--out-dir",
          `dist/${buildOptions.outputDir}`,
        ],
        {
          stdio: "inherit",
          cwd: _cwd,
        },
      )
    }
    logger.log({
      level: "info",
      description: `done bundling ${pkg?.name}`,
      context: "build:bundle",
    })
  } catch (error) {
    logger.log({
      level: "error",
      description: `error during ${packageName} build`,
      context: "build:bundle",
      data: error,
    })
  }
}

/**
 * Bundle all packages or just a specified one
 */
export const bundleAll = async (options: BundleOptions = {}): Promise<void> => {
  // If pkg is set, just bundle that one
  if (options.packageName) {
    await bundle(options)
  } else {
    // Outfile won't work in multi-build mode

    for (const packageName of getPackages()) {
      const pkg = await getPkg(packageName)

      if (pkg?.buildOptions) {
        logger.log({
          level: "info",
          context: "bundleAll",
          description: `bundle ${packageName}`,
        })
        await bundle({ ...options, packageName })
      }
    }
  }
}
