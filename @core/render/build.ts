import { distClient, distFolder, distServer, logger } from "@factor/server"

import * as vite from "vite"

import { preRender } from "./prerender"
import { getIndexHtml } from "./render"
import { getViteConfig } from "./vite.config"
import { generateSitemap } from "./sitemap"

/**
 * Builds the production application for server and client
 */
export const buildApp = async (
  options: {
    mode?: "production" | "development"
    prerender?: boolean
    serve?: boolean
  } = {},
): Promise<void> => {
  const { prerender, mode } = options

  logger({
    level: "info",
    context: "build",
    description: "building app",
    data: options,
  })

  /**
   * needed for build error in vuex calling it
   * @remove when fixed
   */
  //global.__VUE_PROD_DEVTOOLS__ = false

  try {
    const vc = getViteConfig(options)

    // build index to dist
    await getIndexHtml(mode)

    const clientBuildOptions: vite.InlineConfig = {
      ...vc,
      root: distFolder(),
      build: {
        outDir: distClient(),
        emptyOutDir: true,
        ssrManifest: true,
      },
    }

    const serverBuildOptions: vite.InlineConfig = {
      ...vc,

      build: {
        emptyOutDir: true,
        outDir: distServer(),
        ssr: true,
        rollupOptions: {
          preserveEntrySignatures: "allow-extension", // not required
          input: require.resolve("@factor/entry"),
        },
      },
    }

    await Promise.all([
      vite.build(clientBuildOptions),
      vite.build(serverBuildOptions),
    ])

    await generateSitemap()

    logger({
      level: "info",
      context: "build",
      description: "application built successfully",
    })

    if (prerender) {
      await preRender(options)
    }
  } catch (error) {
    logger({
      level: "error",
      context: "build",
      description: "error during build",
      data: error,
    })
  }

  return
}
