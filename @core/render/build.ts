import { distClient, distFolder, distServer } from "@factor/engine/nodeUtils"
import { logger } from "@factor/api"
import * as vite from "vite"

import { preRender } from "./prerender"
import { getIndexHtml } from "./render"
import { getViteConfig } from "./vite.config"
import { generateSitemap } from "./sitemap"

import { createRequire } from "module"

const require = createRequire(import.meta.url)

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

  logger.log({
    level: "info",
    context: "build",
    description: "building app",
    data: options,
  })

  try {
    const vc = await getViteConfig(options)

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
          output: { format: "es" },
        },
      },
    }

    await Promise.all([
      vite.build(clientBuildOptions),
      vite.build(serverBuildOptions),
    ])

    await generateSitemap()

    logger.log({
      level: "info",
      context: "build",
      description: "application built successfully",
    })

    if (prerender) {
      await preRender(options)
    }
  } catch (error) {
    logger.log({
      level: "error",
      context: "build",
      description: "error during build",
      data: error,
    })
  }

  return
}
