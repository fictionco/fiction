import { sourceFolder, cwd } from "@factor/server"
import { requireIfExists, setAppGlobals } from "@factor/server-utils"
import pluginVue from "@vitejs/plugin-vue"

import { deepMerge, deepMergeAll, getMarkdownUtility } from "@factor/api"
import fs from "fs"
import path from "path"
import * as vite from "vite"
import pluginMarkdown, { Mode } from "vite-plugin-markdown"

const tailwindConfig = (): Record<string, any> | undefined => {
  const baseTailwindConfig = require("./tailwind.config")

  const c = [baseTailwindConfig]

  const userTailwindConfig = requireIfExists(
    path.join(cwd(), "tailwind.config"),
  )

  if (userTailwindConfig) c.push(userTailwindConfig)

  const config = deepMerge<Record<string, any>>(c)

  return config
}

const getAppViteConfig = (): Record<string, any> | undefined => {
  return requireIfExists(path.join(cwd(), "vite.config"))
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
        "@darwin_/*",
        "@factor/api",
        "@factor/entry",
        "@factor/plugin-notify",
        "@factor/plugin-stripe",
        "@darwin_/blog",
        "@darwin_/client",
      ],
      include: [
        "vuex",
        "vue-router",
        "@vueuse/head",
        "vue",
        "dayjs",
        "dayjs/plugin/timezone",
        "dayjs/plugin/utc",
        "dayjs/esm",
        "dayjs/esm/plugin/relativeTime",
        "dayjs/esm/plugin/timezone",
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

export const getViteConfig = (
  options: Partial<vite.InlineConfig> = {},
): vite.InlineConfig => {
  setAppGlobals()
  const root = sourceFolder()

  const basicConfig: vite.InlineConfig = {
    root,
    publicDir: path.join(root, "public"),
    server: {
      port: 3000,
      // fsServe: { root: path.relative(entryDir, `../../../..`) },
    },

    css: {
      //postcss: path.join(cwd(), "postcss.config.js"),
      postcss: {
        plugins: [
          require("tailwindcss")(tailwindConfig()),
          require("autoprefixer"),
        ],
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
      "process.env.FACTOR_API_ENV": JSON.stringify(
        process.env.FACTOR_API_ENV ?? "local",
      ),
      "process.env.FACTOR_ENDPOINT_URL": JSON.stringify(
        process.env.FACTOR_ENDPOINT_URL ?? "http://localhost:3210",
      ),
      "process.env.STRIPE_ENV": JSON.stringify(process.env.STRIPE_ENV),
      "process.env.STRIPE_PUBLIC_KEY": JSON.stringify(
        process.env.STRIPE_PUBLIC_KEY,
      ),
      "process.env.STRIPE_PUBLIC_KEY_TEST": JSON.stringify(
        process.env.STRIPE_PUBLIC_KEY_TEST,
      ),
      "process.env.FACTOR_APP_URL": JSON.stringify(process.env.FACTOR_APP_URL),
      "process.env.FACTOR_APP_NAME": JSON.stringify(
        process.env.FACTOR_APP_NAME,
      ),
      "process.env.FACTOR_APP_EMAIL": JSON.stringify(
        process.env.FACTOR_APP_EMAIL,
      ),
      "process.env.FACTOR_APP_DOMAIN": JSON.stringify(
        process.env.FACTOR_APP_DOMAIN,
      ),
    },

    plugins: [
      pluginVue(),
      pluginMarkdown({
        mode: [Mode.VUE, Mode.HTML],
        markdownIt: getMarkdownUtility(),
      }),
      /**
       * https://rollupjs.org/guide/en/#resolveid
       */
      {
        name: "resolveApp",
        resolveId: (source: string): string | null => {
          const match = source.match(/@alias\/app(.*)/)

          if (match) {
            const file = match[1] ?? ""

            const appFile = path.join(sourceFolder(), file)

            const actualFile = fs.existsSync(appFile)
              ? appFile
              : path.join(entryDir, file)

            return actualFile
          } else return null
        },
      },
    ],
    ...optimizeDeps(),
  }

  const merge = [basicConfig, options]

  // If the app has a vite config, merge it
  const appViteConfig = getAppViteConfig()

  if (appViteConfig?.default) {
    merge.push(appViteConfig.default)
  }

  const conf: vite.InlineConfig = deepMergeAll(merge)

  return conf
}
