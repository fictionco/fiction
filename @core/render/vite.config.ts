import path from "path"
import { createRequire } from "module"
import {
  importIfExists,
  requireIfExists,
  sourceFolder,
  cwd,
} from "@factor/engine/nodeUtils"
import { setAppGlobals } from "@factor/server/globals"
import { logger, deepMergeAll, getMarkdownUtility } from "@factor/api"
import pluginVue from "@vitejs/plugin-vue"
import * as vite from "vite"
import * as pluginMarkdown from "vite-plugin-markdown"
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

const entryDir = path.dirname(require.resolve("@factor/entry"))

/**
 * Common vite options for all builds
 */
const optimizeDeps = (): Partial<vite.InlineConfig> => {
  return {
    optimizeDeps: {
      exclude: [
        "@factor/*",
        "@kaption/*",
        "@factor/api",
        "@factor/build",
        "@factor/entry",
        "@factor/engine",
        "@factor/server",
        "@factor/cli",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@kaption/client",
        ...getServerOnlyModules().map((_) => _.id),
      ],
      include: [
        "vuex",
        "vue-router",
        "@vueuse/head",
        "vue",
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
  options: Partial<vite.InlineConfig> = {},
  otherConfig: {
    bundleType?: "script" | "app"
    variables?: Record<string, string>
  } = {},
): Promise<vite.InlineConfig> => {
  const { bundleType } = otherConfig
  const vars = await setAppGlobals(otherConfig)

  const defines = Object.fromEntries(
    Object.entries(vars).map(([key, value]) => {
      return [`process.env.${key}`, JSON.stringify(value)]
    }),
  )

  if (bundleType == "app") {
    logger.log({
      level: "info",
      context: "build",
      description: `build variables`,
      data: vars,
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
    },
    resolve: {
      alias: {
        "@src": root,
        "@cwd": cwd(),
        "@entry": entryDir,
        "@alias/app": entryDir,
      },
    },

    define: {
      "process.env.STRIPE_ENV": JSON.stringify(process.env.STRIPE_ENV),
      "process.env.STRIPE_PUBLIC_KEY": JSON.stringify(
        process.env.STRIPE_PUBLIC_KEY,
      ),
      "process.env.STRIPE_PUBLIC_KEY_TEST": JSON.stringify(
        process.env.STRIPE_PUBLIC_KEY_TEST,
      ),
      ...defines,
    },

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

  const merge = [basicConfig, options]

  // If the app has a vite config, merge it
  const appViteConfig = await getAppViteConfig()

  if (appViteConfig) {
    merge.push(appViteConfig)
  }

  const conf: vite.InlineConfig = deepMergeAll(merge)

  return conf
}
