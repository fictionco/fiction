import path from 'node:path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import type { OutputOptions, Plugin, RollupError, RollupOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import analyzer from 'rollup-plugin-analyzer'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import resolveCommonJS from '@rollup/plugin-commonjs'
import vuePlugin from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import type { PackageJson } from '@factor/types'
import type { BuildStage } from '@kaption/types'
import { getCustomBuildPlugins } from '@factor/cjs'

// ensure TS checks only once for each build
let hasTSChecked = false

type NodeEnvironment = 'production' | 'development'
interface ScriptBuildConfig {
  packageName: string
  NODE_ENV?: NodeEnvironment
  STAGE_ENV?: BuildStage
  commit?: string
  sourceMap?: boolean
  buildTypes?: boolean
  file?: string
  name?: string
  output?: OutputOptions
}

export function packageDir(packageName: string): string {
  return path.dirname(require.resolve(`${packageName}/package.json`))
}

function resolve(packageName: string, ...args: string[]): string {
  return path.resolve(packageDir(packageName), ...args)
}

function getPkg(packageName: string): PackageJson {
  return require(resolve(packageName, `package.json`)) as PackageJson
}

/**
 * Get the information provided by manifest (package.json) for a module
 */
function packageInfo(packageName: string): {
  entryFile?: string
  entryName?: string
  types?: string
  fileNamePackage: string
  outputDir?: string
  outputDirDev?: string
} {
  const { buildOptions, types } = getPkg(packageName)
  const { entryName, entryFile, outputDir, outputDirDev } = buildOptions
  return {
    fileNamePackage: path.basename(packageDir(packageName)),
    entryName,
    entryFile,
    types,
    outputDir,
    outputDirDev,
  }
}
/**
 * Get appropriate file name for output
 */
function getOutput(config: ScriptBuildConfig): OutputOptions[] {
  const { packageName, NODE_ENV, commit } = config
  const pkg = getPkg(packageName)

  const { fileNamePackage, entryName, outputDir, outputDirDev }
    = packageInfo(packageName)

  const output: OutputOptions = {}
  output.externalLiveBindings = false
  output.name = entryName || fileNamePackage
  output.banner = `/*-- Kaption v${pkg.version} [${commit}] --*/`
  output.format = 'es'
  const dir
    = outputDirDev && NODE_ENV === 'development' ? outputDirDev : outputDir
  output.dir = resolve(packageName, `dist`, dir ?? '')

  return [output]
}

/**
 * Create the full rollup config for a specific build
 */
async function createConfig(config: ScriptBuildConfig, plugins: Plugin[] = []): Promise<RollupOptions> {
  const { packageName, NODE_ENV, STAGE_ENV, sourceMap, output, buildTypes }
    = config
  const { entryFile = 'index.ts', types } = packageInfo(packageName)

  const tsconfig = path.resolve(process.cwd(), 'tsconfig.json')
  const dir = packageDir(packageName)

  const relativeDir = path.relative(process.cwd(), dir)

  const shouldEmitDeclarations = types && buildTypes && !hasTSChecked
  const tsPlugin: Plugin = ts({
    check: false,
    tsconfig,
    tsconfigOverride: {
      compilerOptions: {
        sourceMap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      // relative to where .tsconfig is located
      include: [`${relativeDir}/*.ts`, `${relativeDir}/**/*.ts`],
      exclude: [
        '**/node_modules',
        '**/__tests__',
        '**/test',
        '**/cdk',
        '**/cdk.out',
        '**/dist',
        '**/scripts',
        '*.d.ts',
        '**/*.d.ts',
      ],
    },
  })

  hasTSChecked = true

  const nodePlugins = [
    resolveCommonJS({ sourceMap: false }),
    nodePolyfills() as Plugin,
    nodeResolve({
      preferBuiltins: true,
      browser: true,
    }),
  ]

  return {
    input: resolve(packageName, entryFile),
    output,
    plugins: [
      vuePlugin(),
      json({ namedExports: false }),
      tsPlugin,
      replace({
        'process.env.STAGE_ENV': JSON.stringify(STAGE_ENV),
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'preventAssignment': true,
      }),
      ...nodePlugins,
      postcss({ extract: true, plugins: [] }), // frame css
      ...getCustomBuildPlugins(),
      ...plugins,
    ],
    preserveSymlinks: true, // yarn link
    treeshake: { moduleSideEffects: false },
    onwarn: (warning: RollupError): void => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        // eslint-disable-next-line no-console
        console.log(`(rollup) ${warning.message}`)
        // eslint-disable-next-line no-console
        console.log(warning)
      }
    },
  }
}

export async function getConfig(config: ScriptBuildConfig): Promise<RollupOptions[] | undefined> {
  if (!config.packageName)
    return

  const { NODE_ENV } = config

  const outputs = getOutput(config)

  const _promises = outputs.map(async (output) => {
    const inputConfig = { ...config, output }
    let rollupConfig: RollupOptions
    if (NODE_ENV === 'production') {
      rollupConfig = await createConfig(inputConfig, [
        terser({ ecma: 2020, mangle: true, format: { comments: /^--/ } }),
        analyzer({ summaryOnly: true }),
      ])
    }
    else {
      rollupConfig = await createConfig(inputConfig)
    }

    return rollupConfig
  })

  return Promise.all(_promises)
}

export async function getCliConfig(): Promise<RollupOptions[] | undefined> {
  const configVars: ScriptBuildConfig = {
    NODE_ENV: process.env.NODE_ENV as NodeEnvironment,
    STAGE_ENV: process.env.STAGE_ENV as BuildStage,
    commit: process.env.COMMIT,
    packageName: process.env.PKG as string,
    sourceMap: !!process.env.SOURCE_MAP,
    buildTypes: !!process.env.TYPES,
  }

  const config = await getConfig(configVars)

  return config
}

export default getCliConfig()
