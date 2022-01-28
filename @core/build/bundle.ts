import path from "path"
import { performance } from "perf_hooks"
import fs from "fs-extra"
import { logger } from "@factor/api"
import { getPackages, getCommit } from "./utils"
import * as rollup from "rollup"
import { getConfig } from "./rollupBuildConfig"

import { createRequire } from "module"

const require = createRequire(import.meta.url)

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

/**
 * Run a child process for rollup that builds scripts based on options
 */
export const bundle = async (options: BundleOptions): Promise<void> => {
  const {
    packageName,
    NODE_ENV = "production",
    sourceMap,
    outFile = "",
  } = options

  if (!packageName) throw new Error("no pkg name available")

  let { commit } = options

  fs.removeSync(`${packageName}/dist`)

  // pass in git commit via env var
  if (!commit && process.env.GIT_COMMIT) {
    commit = process.env.GIT_COMMIT
  } else if (!commit) {
    commit = await getCommit()
  }

  const rollupOptions = await getConfig({
    packageName,
    commit,
    outFile,
    sourceMap,
    NODE_ENV,
  })

  const t1 = performance.now()
  const bundle = await rollup.rollup(rollupOptions)

  logger.log({
    level: "info",
    context: "bundle",
    description: `${packageName} - ${Math.round(
      (performance.now() - t1) / 1000,
    )}s`,
  })

  const output = rollupOptions.output as rollup.OutputOptions

  await bundle.write(output)

  logger.log({
    level: "info",
    context: "bundle",
    description: `${packageName} - dist - ${path.basename(
      output.file as string,
    )}`,
  })

  // closes the bundle
  await bundle.close()
}

const getModuleBuildOptions = (pkg: string): BundleOptions => {
  const { buildOptions } = require(`${pkg}/package.json`)

  return buildOptions
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
          context: "bundle",
          description: `bundle ${packageName}`,
        })
        await bundle({ ...options, packageName })
      }
    }
  }
}
