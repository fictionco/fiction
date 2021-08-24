import path from "path"
import ts from "rollup-plugin-typescript2"
import replace from "@rollup/plugin-replace"
import json from "@rollup/plugin-json"
import { Plugin, RollupOptions, OutputOptions } from "rollup"
import { nLog } from "@factor/server-utils"
import { terser } from "rollup-plugin-terser"
import analyzer from "rollup-plugin-analyzer"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import nodeBuiltins from "rollup-plugin-node-builtins"
import nodeGlobals from "rollup-plugin-node-globals"
import resolveCommonJS from "@rollup/plugin-commonjs"
import vuePlugin from "rollup-plugin-vue"
import postcss from "rollup-plugin-postcss"

interface ScriptBuildConfig {
  packageName: string
  outFile?: string
  NODE_ENV?: "production" | "development"
  commit?: string
  sourceMap?: boolean

  file?: string
  name?: string
}

const packageDir = (packageName: string): string => {
  return path.dirname(require.resolve(`${packageName}/package.json`))
}

const resolve = (packageName: string, p: string): string => {
  return path.resolve(packageDir(packageName), p)
}

const getPkg = (packageName: string): Record<string, any> => {
  return require(resolve(packageName, `package.json`))
}

const packageOptions = (
  packageName: string,
): Partial<{
  name: string
  fileProd: string
  fileDev: string
}> => getPkg(packageName).buildOptions || {}

/**
 * Get the information provided by manifest (package.json) for a module
 */
const packageInfo = (
  packageName: string,
): { main: string; fileName: string } => {
  return {
    fileName: path.basename(packageDir(packageName)),
    ...require(resolve(packageName, `package.json`)),
  }
}
/**
 * Get appropriate file name for output
 */
const getFilename = (config: ScriptBuildConfig): string => {
  const { outFile, packageName, NODE_ENV } = config
  const { fileName } = packageInfo(packageName)

  const { fileProd, fileDev } = packageOptions(packageName)

  const defaultName: string =
    NODE_ENV == "production"
      ? fileProd ?? `${fileName}.min`
      : fileDev ?? fileName

  return outFile ? path.basename(outFile) : defaultName
}

/**
 * Create the full rollup config for a specific build
 */
const createConfig = (
  config: ScriptBuildConfig,
  plugins: Plugin[] = [],
): RollupOptions => {
  const { packageName, file, commit, NODE_ENV, sourceMap } = config
  const { main } = packageInfo(packageName)
  const entryFile = main ?? "index.ts"
  const pkg = getPkg(packageName)

  const output: OutputOptions = { file, format: "iife" }

  output.externalLiveBindings = false
  output.name = packageOptions(packageName).name
  output.banner = `/*-- Darwin v${pkg.version} [${commit}] --*/`

  const tsconfig = path.resolve(process.cwd(), "tsconfig.json")

  const tsPlugin: Plugin = ts({
    check: false,
    tsconfig,
    tsconfigOverride: {
      compilerOptions: { sourceMap },
      include: [packageDir(packageName)],
      exclude: ["**/__tests__", "**/test"],
    },
  })

  return {
    input: resolve(packageName, entryFile),
    output,
    plugins: [
      vuePlugin(),
      json({ namedExports: false }),
      tsPlugin,
      replace({
        "process.env.NODE_ENV": `"${NODE_ENV}"`,
        preventAssignment: true,
      }),
      nodeResolve({ preferBuiltins: true }),
      resolveCommonJS({ sourceMap: false }),
      nodeBuiltins() as Plugin,
      nodeGlobals() as Plugin,
      postcss({ extract: true, plugins: [] }),
      ...plugins,
    ],

    treeshake: { moduleSideEffects: false },
    onwarn: (warning: any): void => {
      if (warning.code !== "CIRCULAR_DEPENDENCY") {
        nLog("warn", `(rollup) ${warning.message}`, warning)
      }
    },
  }
}

export const getConfig = async (
  config: ScriptBuildConfig,
): Promise<RollupOptions> => {
  const { packageName, NODE_ENV } = config

  const { name = getFilename(config) } = config
  const ext = ".js"

  config.file = resolve(packageName, `dist/${name}${ext}`)

  let rollupConfig: RollupOptions
  if (NODE_ENV == "production") {
    rollupConfig = createConfig(config, [
      terser({ ecma: 2020, mangle: true, format: { comments: /^--/ } }),
      analyzer({ summaryOnly: true }),
    ])
  } else {
    rollupConfig = createConfig(config)
  }

  return rollupConfig
}
