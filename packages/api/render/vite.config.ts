import path from "path"
import { createRequire } from "module"
import pluginVue from "@vitejs/plugin-vue"
import * as vite from "vite"
import * as pluginMarkdown from "vite-plugin-markdown"
import {
  importIfExists,
  requireIfExists,
  sourceFolder,
  cwd,
} from "../engine/nodeUtils"
import { setAppGlobals } from "../server/globals"
import { deepMergeAll, getMarkdownUtility } from ".."
import { logger } from "../logger"
import { UserConfig } from "../types"
import { getUserConfig } from "../engine/plugins"
import { getCustomBuildPlugins, getServerOnlyModules } from "./buildPlugins"

const require = createRequire(import.meta.url)

const tailwindConfig = async (): Promise<Record<string, any> | undefined> => {
  const baseTailwindConfig = await import("./tailwind.config")

  const c: Record<string, any>[] = [baseTailwindConfig.default]

  const userTailwindConfig = await requireIfExists(
    path.join(cwd(), "tailwind.config.cjs"),
  )

  if (userTailwindConfig) {
    const userConf = userTailwindConfig as Record<string, any>
    c.push(userConf)
  }

  const config = deepMergeAll<Record<string, any>>(
    c.map((_) => {
      return { ..._ }
    }),
  )

  return config
}
/**
 * Get the vite config from the CWD app
 */
const getAppViteConfig = async (): Promise<vite.InlineConfig | undefined> => {
  const _module = await importIfExists<{
    default: vite.InlineConfig | (() => Promise<vite.InlineConfig>)
  }>(path.join(cwd(), "vite.config.ts"))

  let config: vite.InlineConfig | undefined = undefined
  const result = _module?.default

  if (result) {
    if (typeof result == "function") {
      config = await result()
    } else {
      config = result
    }
  }

  return config
}

const entryDir = path.join(
  path.dirname(require.resolve("@factor/api")),
  "/entry",
)

/**
 * Common vite options for all builds
 */
const optimizeDeps = (): Partial<vite.InlineConfig> => {
  return {
    optimizeDeps: {
      exclude: [
        "@factor/api",
        "@factor/ui",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@kaption/client",
        ...getServerOnlyModules().map((_) => _.id),
        "vue",
        "@vueuse/head",
        "vue-router",
        "@medv/finder",
      ],
      include: [
        "path-browserify",
        "dayjs",
        "dayjs/plugin/timezone",
        "dayjs/plugin/utc",
        "dayjs/plugin/relativeTime",
        "spark-md5",
        "fast-json-stable-stringify",
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
    },
  }
}

export const getViteConfig = async (
  viteConfig: Partial<vite.InlineConfig> = {},
  addUserConfig: UserConfig = {},
  options: {
    bundleMode?: "script" | "app"
  } = {},
): Promise<vite.InlineConfig> => {
  const { bundleMode } = options
  const userConfig = getUserConfig()
  const allUserConfig = deepMergeAll<UserConfig>([userConfig, addUserConfig])
  const vars = await setAppGlobals(allUserConfig)

  const define = Object.fromEntries(
    Object.entries(vars).map(([key, value]) => {
      return [`process.env.${key}`, JSON.stringify(value)]
    }),
  )

  const listVars = Object.fromEntries(
    Object.entries(vars).filter(([_key, value]) => value),
  )

  if (bundleMode !== "script" || process.env.NODE_ENV == "production") {
    logger.log({
      level: "info",
      context: "build",
      description: `build variables (${Object.keys(listVars).length} total)`,
      data: listVars,
      disableOnRestart: true,
    })
  }

  const root = sourceFolder()

  const twConfig = await tailwindConfig()

  const twPlugin = require("tailwindcss") as (
    c?: Record<string, any>,
  ) => vite.PluginOption

  const customPlugins = await getCustomBuildPlugins()

  const basicConfig: vite.InlineConfig = {
    root,
    publicDir: path.join(root, "public"),

    server: {
      port: 3000,
      fs: { strict: false },
    },

    css: {
      postcss: {
        plugins: [twPlugin(twConfig), require("autoprefixer")],
      },
    },
    build: {
      manifest: true,
      emptyOutDir: true,
      minify: false,
      sourcemap: process.env.NODE_ENV !== "production",
    },
    resolve: {
      alias: {
        "@src": root,
        "@cwd": cwd(),
        "@entry": entryDir,
        // https://dev.to/0xbf/vite-module-path-has-been-externalized-for-browser-compatibility-2bo6
        path: "path-browserify",
      },
    },

    define,

    plugins: [
      pluginVue(),
      pluginMarkdown.plugin({
        mode: [pluginMarkdown.Mode.VUE, pluginMarkdown.Mode.HTML],
        markdownIt: getMarkdownUtility(),
      }),

      ...customPlugins,
    ],
    ...optimizeDeps(),
  }

  const merge = [basicConfig, viteConfig]

  if (allUserConfig.vite) {
    merge.push(allUserConfig.vite)
  }

  // If the app has a vite config, merge it
  const appViteConfig = await getAppViteConfig()

  if (appViteConfig) {
    merge.push(appViteConfig)
  }

  const conf = deepMergeAll<Partial<vite.InlineConfig>>(merge)

  return conf
}
