import type * as vite from "vite"
import type * as esLexer from "es-module-lexer"
import type * as cjsLexer from "cjs-module-lexer"
import { FactorPlugin, UserConfig } from "../config"
import { FactorEnv } from "../plugin-env"
import * as types from "./types"
import { commonServerOnlyModules } from "./serverOnly"

type FactorBuildSettings = {
  serverOnlyModules?: types.ServerModuleDef[]
  factorEnv: FactorEnv<string>
  mode?: "production" | "development"
}

export class FactorBuild extends FactorPlugin<FactorBuildSettings> {
  types = types
  serverOnlyModules: types.ServerModuleDef[]
  esLexer?: typeof esLexer
  cjsLexer?: typeof cjsLexer
  factorEnv: FactorEnv<string>
  mode: "development" | "production"
  constructor(settings: FactorBuildSettings) {
    super(settings)
    this.serverOnlyModules = settings.serverOnlyModules ?? []
    this.getLexers().catch(console.error)
    this.factorEnv = settings.factorEnv
    this.mode = settings.mode || "production"
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

  async setup(): Promise<UserConfig> {
    return {}
  }

  getReplacedModule = (opts: {
    id?: string
    src: string
    type: "comment" | "map"
  }): string => {
    const { src, id = "?" } = opts

    if (!this.esLexer || !this.cjsLexer) {
      throw new Error("module parsers missing")
    }

    const fileExports: string[] = []

    if (src.includes("exports")) {
      const { exports: cjsExports } = this.cjsLexer.parse(src)
      fileExports.push(...cjsExports)
    } else {
      const [_imports, esExports] = this.esLexer.parse(src)
      fileExports.push(...esExports)
    }

    const modExports = fileExports.filter((_) => _ != "default")

    const mock = `{}`

    const namedExports =
      modExports.length > 0
        ? modExports.map((_) => `export const ${_} = ${mock}`).join(`\n`)
        : ""

    const newSource = [
      `// replaced file: ${id}`,
      `export default ${mock}`,
      `${namedExports}`,
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
    const serverOnlyModules = this.getServerOnlyModules()

    const fullServerModules = serverOnlyModules.map((_) => {
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
        name: "serverModuleReplacer", // required, will show up in warnings and errors
        enforce: "pre",
        // resolveId(id: string): ResolveIdResult {
        //   const found = fullServerModules.find((_) => _.id == id)
        //   if (found) {
        //     return found.resolvedId
        //   }
        // },
        transform: async (src: string, id: string) => {
          const isServerPackage = fullServerModules.find((_) => {
            return id.includes(`node_modules/${_.id}`)
          })

          const isServerFile = /server-only-file/.test(src.slice(0, 300))

          if (isServerPackage || isServerFile) {
            const code = this.getReplacedModule({ src, id, type: "map" })
            return { code }
          }
        },
        config: () => {
          return {
            build: {
              rollupOptions: {
                external: serverOnlyModules
                  .filter((_) => _.external)
                  .map((_) => _.id),
              },
            },
          }
        },
      },
    ]

    return plugins
  }

  getServerOnlyModules = (): types.ServerModuleDef[] => {
    return [...commonServerOnlyModules(), ...(this.serverOnlyModules || [])]
  }

  /**
   * Common vite options for all builds
   */
  getOptimizeDeps = (): Partial<vite.InlineConfig["optimizeDeps"]> => {
    const configExcludeIds = this.getServerOnlyModules().map((_) => _.id)

    return {
      exclude: [
        "@factor/api",
        "@factor/ui",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@kaption/client",
        "vue",
        "vite",
        "@vueuse/head",
        "vue-router",
        "@medv/finder",
        ...configExcludeIds,
      ],
      include: [
        "ohmyfetch",
        "path-browserify",
        "dayjs",
        "dayjs/plugin/timezone",
        "dayjs/plugin/utc",
        "dayjs/plugin/relativeTime",
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
        "gravatar",
        "validator",
      ],
    }
  }

  getCommonViteConfig = async (): Promise<vite.InlineConfig> => {
    const { sourceDir, publicDir } = this.factorEnv.standardPaths

    if (!sourceDir) throw new Error("sourceDir is required")
    if (!publicDir) throw new Error("publicDir is required")

    const root = sourceDir

    const customPlugins = await this.getCustomBuildPlugins()

    const { default: pluginVue } = await import("@vitejs/plugin-vue")

    const basicConfig: vite.InlineConfig = {
      mode: this.mode,
      root,
      publicDir,
      server: {
        fs: { strict: false },
        watch: {
          ignored: ["!**/node_modules/@factor/**"],
        },
      },

      build: {
        manifest: true,
        emptyOutDir: true,
        minify: false,
        sourcemap: this.mode !== "production",
      },
      resolve: {
        alias: {
          // https://dev.to/0xbf/vite-module-path-has-been-externalized-for-browser-compatibility-2bo6
          path: "path-browserify",
        },
      },

      plugins: [pluginVue(), ...customPlugins],
      optimizeDeps: this.getOptimizeDeps(),
    }

    return basicConfig
  }
}
