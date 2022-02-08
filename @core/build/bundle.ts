import path from "path"
import fs from "fs-extra"
import {
  logger,
  PackageJson,
  PackageBuildOptions,
  deepMergeAll,
} from "@factor/api"
import { getPackages, getCommit } from "./utils"
import { execa } from "execa"
import * as vite from "vite"
import { getViteConfig } from "@factor/render/vite.config"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

export const packageDir = (packageName: string): string => {
  return path.dirname(require.resolve(`${packageName}/package.json`))
}

interface BundleOptions {
  packageName?: string
  NODE_ENV?: "production" | "development"
  commit?: string
  sourceMap?: boolean
  outFile?: string
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

const getModuleBuildOptions = (
  pkg: string,
): PackageJson["buildOptions"] | undefined => {
  const { buildOptions } = require(`${pkg}/package.json`) as PackageJson

  return buildOptions
}

/**
 * Run a child process for rollup that builds scripts based on options
 */
export const bundle = async (options: BundleOptions): Promise<void> => {
  const { packageName, NODE_ENV } = options
  try {
    if (!packageName) throw new Error("no pkg name available")
    const buildOptions = getModuleBuildOptions(packageName)

    logger.log({
      level: "info",
      description: `bundling ${packageName}`,
      context: "cli bundle",
    })

    let { commit } = options

    const pkgDir = packageDir(packageName)

    fs.removeSync(`${pkgDir}/dist`)

    // pass in git commit via env var
    if (!commit && process.env.GIT_COMMIT) {
      commit = process.env.GIT_COMMIT
    } else if (!commit) {
      commit = await getCommit()
    }

    const vc = await getViteConfig({ mode: NODE_ENV })

    const root = packageDir(packageName)

    if (!buildOptions?.entryFile) throw new Error("no entry file")

    const clientBuildOptions = deepMergeAll<vite.InlineConfig>([
      vc,
      {
        root: root,
        build: {
          outDir: path.join(
            packageDir(packageName),
            "/dist",
            buildOptions.outputDir ?? "",
          ),
          emptyOutDir: true,
          lib: {
            formats: ["es"],
            entry: buildOptions?.entryFile,
            name: buildOptions.entryName,
            fileName: () => `index.js`,
          },
        },
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
          cwd: packageDir(packageName),
        },
      )
    }
  } catch (error) {
    logger.log({
      level: "error",
      description: `error during ${packageName} build`,
      context: "cli bundle",
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
    delete options.outFile
    for (const packageName of getPackages()) {
      const buildOptions = getModuleBuildOptions(packageName)

      if (buildOptions) {
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
