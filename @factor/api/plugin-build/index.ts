import path from "path"
import type * as vite from "vite"
import type * as esLexer from "es-module-lexer"
import type * as cjsLexer from "cjs-module-lexer"
import { FactorPlugin } from "../plugin"
import { safeDirname } from "../utils"
import type { FactorEnv } from "../plugin-env"

export * from "./plugin-release"

type FactorBuildSettings = {
  factorEnv: FactorEnv
}

export class FactorBuild extends FactorPlugin<FactorBuildSettings> {
  esLexer?: typeof esLexer
  cjsLexer?: typeof cjsLexer
  loadingPromise: Promise<void> | undefined
  factorEnv = this.settings.factorEnv
  root = safeDirname(import.meta.url)
  constructor(settings: FactorBuildSettings) {
    super("build", settings)
    this.loadingPromise = this.getLexers().catch(console.error)
  }

  async getLexers() {
    if (!this.utils.isApp()) {
      const [esLexer, cjsLexer] = await Promise.all([
        import(/* @vite-ignore */ "es-module-lexer"),
        import(/* @vite-ignore */ "cjs-module-lexer"),
      ])
      this.esLexer = esLexer
      this.cjsLexer = cjsLexer
    }
  }

  getReplacedModule = (opts: {
    id?: string
    src: string
    type: "comment" | "map"
    additional: string[]
  }): string => {
    const { src, id = "?", additional } = opts

    if (!this.esLexer || !this.cjsLexer) {
      throw new Error("module parsers missing")
    }

    const fileExports: string[] = []

    try {
      if (src.includes("exports") && !src.includes("import")) {
        const { exports: cjsExports } = this.cjsLexer.parse(src)
        fileExports.push(...cjsExports)
      } else {
        const [_imports, esExports] = this.esLexer.parse(src)
        fileExports.push(...esExports.map((ex) => ex.n))
      }
    } catch (error) {
      this.log.error(`error parsing server-only module ${id}`, { error })
    }

    const modExports = fileExports.filter((_) => _ != "default")

    const mock = `{}`

    const namedExports =
      modExports.length > 0
        ? modExports.map((_) => `export const ${_} = ${mock}`)
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

    const fullServerModules = this.factorEnv.serverOnlyModules.map((_) => {
      return {
        ..._,
        resolvedId: `\0${_.id}`,
      }
    })

    if (!this.esLexer || !this.cjsLexer) {
      throw new Error("getCustomBuildPlugins: module parsers missing")
    }

    await Promise.all([this.esLexer.init, this.cjsLexer.init()])

    const plugins: vite.Plugin[] = [
      {
        name: "factorVitePlugin", // required, will show up in warnings and errors
        enforce: "pre",
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

          let code = src
          if (id.includes("mount.ts")) {
            code = src.replace(
              `"VITE_REPLACE_ENV_VARS"`,
              JSON.stringify(
                JSON.stringify(this.factorEnv.getViteRenderedVars()),
              ),
            )

            return { code }
          }

          const isServerFile = /server-only-file/.test(src.slice(0, 300))

          /**
           * Get existing sourcemaps by setting it to null
           * - https://rollupjs.org/guide/en/#transform
           */
          if (replaceConfig || isServerFile) {
            const additional = replaceConfig?.additional ?? []

            const code = this.getReplacedModule({
              src,
              id,
              type: "map",
              additional,
            })
            return { code, map: null }
          }
        },
      },
      // {
      //   name: "factorVitePluginPost",
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
  getOptimizeDeps = (): Partial<vite.InlineConfig["optimizeDeps"]> => {
    const configExcludeIds = this.factorEnv.serverOnlyModules.map((_) => _.id)

    return {
      exclude: [
        "@factor/api",
        "@factor/ui",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@factor/plugin-highlight-code",
        "@kaption/client",
        "vue",
        "vite",
        "@vueuse/head",
        "vue-router",
        "@medv/finder",
        "es-module-lexer",
        "cjs-module-lexer",
        "module",
        ...configExcludeIds,
      ],
      include: [
        "is-plain-object",
        "fast-safe-stringify",
        "ohmyfetch",
        "path-browserify",
        "dayjs",
        "dayjs/plugin/timezone",
        "dayjs/plugin/utc",
        "dayjs/plugin/relativeTime",
        "dayjs/plugin/updateLocale",
        "dayjs/plugin/weekOfYear",
        "spark-md5",
        "deepmerge",
        "events",
        "js-cookie",
        "axios",
        "qs",
        "nanoid",
        "front-matter",
        "string-similarity",
        "markdown-it",
        "markdown-it-link-attributes",
        "markdown-it-video",
        "markdown-it-anchor",
        "markdown-it-implicit-figures",
        "remove-markdown",
        "gravatar-url",
        "validator",
        "highlight.js",
      ],
    }
  }

  getStaticPathAliases = (opts: {
    mainFilePath?: string
  }): Record<string, string> => {
    const { mainFilePath } = opts

    const out: Record<string, string> = {
      "@MOUNT_FILE_ALIAS": path.join(
        safeDirname(import.meta.url, ".."),
        "/plugin-app/mount.ts",
      ),
      "@MAIN_FILE_ALIAS": mainFilePath || path.join(this.root, "./blank.ts"),
    }

    return out
  }

  getCommonViteConfig = async (options: {
    isProd: boolean
    root?: string
    mainFilePath?: string
  }): Promise<vite.InlineConfig> => {
    const { isProd, root = process.cwd(), mainFilePath } = options

    const customPlugins = await this.getCustomBuildPlugins()

    const external: string[] = [] // this.factorEnv.serverOnlyModules.map((_) => _.id)

    const basicConfig: vite.InlineConfig = {
      mode: isProd ? "production" : "development",
      // root must be set to optimize output file size
      root,
      ssr: {
        noExternal: [/@factor.*/, /@kaption.*/],
      },
      server: {
        fs: { strict: false },
        watch: {
          ignored: [
            "!**/node_modules/@factor/**",
            "!**/node_modules/**/@factor/**",
          ],
        },
        // SET A CUSTOM HMR PORT
        // randomly if the same port is used, it can conflict silently
        // preventing HMR from working. Setting this way prevents it .
        hmr: { port: this.utils.randomBetween(10_000, 20_000) },
      },

      build: {
        target: ["esnext"],
        manifest: true,
        emptyOutDir: true,
        minify: false,

        //https://vitejs.dev/config/build-options.html#build-sourcemap
        sourcemap: !isProd ? "inline" : false,
        rollupOptions: {
          external,
        },
      },
      resolve: {
        alias: {
          ...this.getStaticPathAliases({ mainFilePath }),
          // https://dev.to/0xbf/vite-module-path-has-been-externalized-for-browser-compatibility-2bo6
          path: "path-browserify",
        },
      },

      plugins: customPlugins,
      optimizeDeps: this.getOptimizeDeps(),
      logLevel: isProd ? "info" : "warn",
    }

    return basicConfig
  }
}
