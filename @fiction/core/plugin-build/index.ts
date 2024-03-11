import process from 'node:process'
import type * as vite from 'vite'
import type * as esLexer from 'es-module-lexer'
import type * as cjsLexer from 'cjs-module-lexer'
import { FictionPlugin } from '../plugin'
import { deepMergeAll, safeDirname } from '../utils'
import type { FictionEnv } from '../plugin-env'

export * from './plugin-release'

interface FictionBuildSettings {
  fictionEnv: FictionEnv
}

export class FictionBuild extends FictionPlugin<FictionBuildSettings> {
  esLexer?: typeof esLexer
  cjsLexer?: typeof cjsLexer
  loadingPromise: Promise<void> | undefined
  fictionEnv = this.settings.fictionEnv
  root = safeDirname(import.meta.url)
  constructor(settings: FictionBuildSettings) {
    super('build', settings)
    this.loadingPromise = this.getLexers().catch(console.error)
  }

  async getLexers() {
    if (!this.fictionEnv.isApp.value) {
      const [esLexer, cjsLexer] = await Promise.all([
        import(/* @vite-ignore */ 'es-module-lexer'),
        import(/* @vite-ignore */ 'cjs-module-lexer'),
      ])
      this.esLexer = esLexer
      this.cjsLexer = cjsLexer
    }
  }

  getReplacedModule = (opts: {
    id?: string
    src: string
    type: 'comment' | 'map'
    additional: string[]
  }): string => {
    const { src, id = '?', additional } = opts

    if (!this.esLexer || !this.cjsLexer)
      throw new Error('module parsers missing')

    const fileExports: string[] = []

    try {
      if (src.includes('exports') && !src.includes('import')) {
        const { exports: cjsExports } = this.cjsLexer.parse(src)
        fileExports.push(...cjsExports)
      }
      else {
        const [_imports, esExports] = this.esLexer.parse(src)
        fileExports.push(...esExports.map(ex => ex.n))
      }
    }
    catch (error) {
      this.log.error(`error parsing server-only module ${id}`, { error })
    }

    const modExports = fileExports.filter(_ => _ !== 'default')

    const mock = `{}`

    const namedExports
      = modExports.length > 0
        ? modExports.map(_ => `export const ${_} = ${mock}`)
        : []

    namedExports.push(...additional)

    const newSource = [
      `// replaced file: ${id}`,
      `export default ${mock}`,
      `${namedExports.join(`\n`)}`,
    ].join(`\n`)

    return newSource
  }

  /**
   * Remove and replace modules only meant for server
   *
   * /0 prefix prevents other plugins from messing with module
   * https://rollupjs.org/guide/en/#conventions
   */
  getCustomBuildPlugins = async (): Promise<vite.Plugin[]> => {
    await this.loadingPromise

    const fullServerModules = Object.entries(this.fictionEnv.serverOnlyImports).map(([id, value]) => {
      // construct exports from object
      const additional = typeof value === 'object'
        ? Object.entries(value).map(([imp, importValue]) => {
          return `export const ${imp} = ${importValue}`
        })
        : []

      return {
        id,
        resolvedId: `\0${id}`,
        additional,
      }
    })

    if (!this.esLexer || !this.cjsLexer)
      throw new Error('getCustomBuildPlugins: module parsers missing')

    await Promise.all([this.esLexer.init, this.cjsLexer.init()])

    const plugins: vite.Plugin[] = [
      {
        name: 'fictionVitePlugin', // required, will show up in warnings and errors
        enforce: 'pre',
        // isEntry option is available to inject with
        // async resolveId(id, importer) {
        //   if (id.includes("store")) {
        //     console.warn(`\n`)
        //     console.warn("ID", id)
        //     console.warn("importer", importer)
        //   }
        // },

        transform: async (src: string, id: string) => {
          const replaceConfig = fullServerModules.find((_) => {
            return id.includes(`node_modules/${_.id}`)
          })

          const isServerFile = /server-only-file/.test(src.slice(0, 300))

          /**
           * Get existing sourcemaps by setting it to null
           * - https://rollupjs.org/guide/en/#transform
           */
          if (replaceConfig || isServerFile) {
            const code = this.getReplacedModule({
              src,
              id,
              type: 'map',
              additional: replaceConfig?.additional || [],
            })
            return { code, map: null }
          }
        },
      },
      // {
      //   name: "fictionVitePluginPost",
      //   enforce: "post",
      //   transform: async (code: string, id: string) => {
      //     /**
      //      * add module ID to output for optimization
      //      */
      //     if (!id.includes("json")) {
      //       code = `console.log("${id}")\n\n ${code}`
      //     }
      //     return { code, map: null }
      //   },
      // },
    ]

    return plugins
  }

  /**
   * Common vite options for all builds
   */
  getOptimizeDeps = (): Partial<vite.InlineConfig['optimizeDeps']> => {
    const configExcludeIds = Object.keys(this.fictionEnv.serverOnlyImports)

    return {
      exclude: [
        '@fiction/core',
        '@fiction/ui',
        '@fiction/plugin-notify',
        '@fiction/plugin-stripe',
        '@fiction/plugin-highlight-code',
        '@kaption/client',
        'vue',
        'vite',
        'vue-router',
        '@medv/finder',
        'es-module-lexer',
        'cjs-module-lexer',
        'module',
        ...configExcludeIds,
      ],
      include: [
        'fast-safe-stringify',
        'path-browserify',
        'dayjs',
        'dayjs/plugin/timezone',
        'dayjs/plugin/utc',
        'dayjs/plugin/relativeTime',
        'dayjs/plugin/updateLocale',
        'dayjs/plugin/weekOfYear',
        'spark-md5',
        'deepmerge',
        'events',
        'js-cookie',
        'axios',
        'qs',
        'nanoid',
        'front-matter',
        'remove-markdown',
        'gravatar-url',
        'validator',
        'highlight.js',
      ],
    }
  }

  getFictionViteConfig = async (options: {
    isProd?: boolean
    isServerBuild?: boolean
    root?: string
    mainFilePath?: string
    config?: vite.InlineConfig
  }): Promise<vite.InlineConfig> => {
    const { isProd, root = process.cwd(), config = {}, isServerBuild } = options

    const customPlugins = await this.getCustomBuildPlugins()

    const external: string[] = ['ngrok', 'node:crypto'] // this.fictionEnv.serverOnlyModules.map((_) => _.id)

    const basicConfig: vite.InlineConfig = {
      mode: isProd ? 'production' : 'development',
      // root must be set to optimize output file size
      root,
      ssr: {
        noExternal: [/@fiction.*/, 'util'],
      },
      server: {
        fs: { strict: false },

        watch: {
          ignored: [
            '!**/node_modules/@fiction/**',
            '!**/node_modules/**/@fiction/**',
          ],
        },
        // SET A CUSTOM HMR PORT
        // randomly if the same port is used, it can conflict silently
        // preventing HMR from working. Setting this way prevents it .
        hmr: { port: this.utils.randomBetween(10_000, 20_000) },
      },
      define: {
        // https://github.com/vitejs/vite/discussions/5912
        global: {},
      },

      build: {
        target: ['esnext'],
        manifest: true,
        emptyOutDir: true,
        minify: isProd,

        // https://vitejs.dev/config/build-options.html#build-sourcemap
        sourcemap: isProd ? true : 'inline',
        rollupOptions: { external },
      },

      plugins: [
        ...customPlugins,
      ],
      optimizeDeps: this.getOptimizeDeps(),
      logLevel: isProd ? 'info' : 'warn',
      resolve: {
        alias: [
          { find: 'path', replacement: 'path-browserify' },
          { find: 'node:path', replacement: 'path-browserify' },
          { find: 'node:events', replacement: 'events' },
          { find: 'node:process', replacement: 'process' },
          { find: 'node:fs', replacement: 'fs' },
          { find: 'node:stream', replacement: 'stream-browserify' },
          { find: 'node:os', replacement: 'os-browserify' },
          { find: 'node:buffer', replacement: 'buffer-lite' },
          { find: 'buffer', replacement: 'buffer-lite' },
          { find: 'stream', replacement: 'stream-browserify' },
          { find: 'querystring', replacement: 'querystring-es3' },
          { find: 'node:http', replacement: 'stream-http' },
          { find: 'http', replacement: 'stream-http' },
          { find: 'node:util', replacement: 'util' },
          { find: 'util', replacement: 'util/' },
        ],
      },
    }

    const envBuildConfig: vite.InlineConfig = isServerBuild ? {} : {
      resolve: {
        alias: [
          { find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }, // Specific alias for 'vue'
        ],
      },
    }

    const merge: vite.InlineConfig[] = [basicConfig, envBuildConfig, config]

    return deepMergeAll<vite.InlineConfig>(merge)
  }
}
