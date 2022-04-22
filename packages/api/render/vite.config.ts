import path from "path"
import { createRequire } from "module"
import pluginVue from "@vitejs/plugin-vue"
import * as vite from "vite"
import * as pluginMarkdown from "vite-plugin-markdown"
import { importIfExists, requireIfExists, cwd } from "../engine/nodeUtils"

import { deepMergeAll, getMarkdownUtility } from ".."
import { logger } from "../logger"
import { UserConfig } from "../config/types"
import { RunConfig } from "../cli/utils"
import { getCustomBuildPlugins, getServerOnlyModules } from "./buildPlugins"

const require = createRequire(import.meta.url)

const tailwindConfig = async (
  options: RunConfig,
): Promise<Record<string, any> | undefined> => {
  const { cwd } = options

  if (!cwd) throw new Error("cwd is required")

  const baseTailwindConfig = await import("./tailwind.config")

  const c: Record<string, any>[] = [baseTailwindConfig.default]

  const userTailwindConfig = await requireIfExists(
    path.join(cwd, "tailwind.config.cjs"),
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
const getAppViteConfig = async (
  options: RunConfig,
): Promise<vite.InlineConfig | undefined> => {
  const { cwd } = options

  if (!cwd) throw new Error("cwd is required")
  const _module = await importIfExists<{
    default: vite.InlineConfig | (() => Promise<vite.InlineConfig>)
  }>(path.join(cwd, "vite.config.ts"))

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

/**
 * Common vite options for all builds
 */
const optimizeDeps = (userConfig: UserConfig): Partial<vite.InlineConfig> => {
  const configExcludeIds = getServerOnlyModules(userConfig).map((_) => _.id)

  return {
    server: {
      watch: {
        ignored: ["!**/node_modules/@factor/**"],
      },
    },
    optimizeDeps: {
      exclude: [
        "@factor/api",
        "@factor/ui",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@kaption/client",
        "vue",
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
    },
  }
}

export const getViteConfig = async (
  options: RunConfig & {
    sourceDir: string
    publicDir: string
    entryDir: string
  },
): Promise<vite.InlineConfig> => {
  const {
    bundleMode,
    userConfig = {},
    sourceDir,
    publicDir,
    entryDir,
    portApp,
    mode,
  } = options

  if (!sourceDir) throw new Error("sourceDir is required")
  if (!publicDir) throw new Error("publicDir is required")
  if (!entryDir) throw new Error("entryDir is required")

  const { variables, serverUrl, appUrl } = userConfig
  const vars = {
    ...variables,
    FACTOR_SERVER_URL: serverUrl,
    FACTOR_APP_URL: appUrl,
  }

  const define = Object.fromEntries(
    Object.entries(vars).map(([key, value]) => {
      return [`process.env.${key}`, JSON.stringify(value)]
    }),
  )

  if (bundleMode !== "script" || mode == "production") {
    logger.info(
      "getViteConfig",
      `build variables (${Object.keys(vars).length} total)`,
      {
        data: vars,
        disableOnRestart: true,
      },
    )
  }

  const root = sourceDir

  const twConfig = await tailwindConfig(options)

  const twPlugin = require("tailwindcss") as (
    c?: Record<string, any>,
  ) => vite.PluginOption

  const customPlugins = await getCustomBuildPlugins(userConfig)

  const optimizeDepsConfig = optimizeDeps(userConfig)

  const basicConfig: vite.InlineConfig = {
    root,
    publicDir,

    server: {
      port: portApp ? Number.parseInt(portApp) : 3000,
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
        "~/": `${root}/`,
        "@src": root,
        "@cwd": cwd(),
        "@entry": entryDir,
        // https://dev.to/0xbf/vite-module-path-has-been-externalized-for-browser-compatibility-2bo6
        path: "path-browserify",
      },
    },

    define: { ...define, "process.env.IS_VITE": JSON.stringify("yes") },

    plugins: [
      pluginVue(),
      pluginMarkdown.plugin({
        mode: [pluginMarkdown.Mode.VUE, pluginMarkdown.Mode.HTML],
        markdownIt: getMarkdownUtility(),
      }),

      ...customPlugins,
    ],
    ...optimizeDepsConfig,
  }

  const merge = [basicConfig]

  if (userConfig.vite) {
    merge.push(userConfig.vite)
  }

  // If the app has a vite config, merge it
  const appViteConfig = await getAppViteConfig(options)

  if (appViteConfig) {
    merge.push(appViteConfig)
  }

  const conf = deepMergeAll<Partial<vite.InlineConfig>>(merge)

  return conf
}
