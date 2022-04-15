import { createRequire } from "module"

import * as vite from "vite"
import { logger, isNode } from ".."

import { RunConfig } from "../cli/utils"
import { preRender } from "./prerender"
import { getIndexHtml } from "./serve"
import { getViteConfig } from "./vite.config"
import { generateSitemap } from "./sitemap"

const require = createRequire(import.meta.url)

/**
 * Builds the production application for server and client
 */
export const buildApp = async (options: RunConfig): Promise<void> => {
  const { prerender, dist, distClient, distServer } = options

  logger.info("build", "building application", { data: { ...options, isNode } })

  try {
    const vc = await getViteConfig(options)

    // build index to dist
    await getIndexHtml(options)

    const clientBuildOptions: vite.InlineConfig = {
      ...vc,
      root: dist,
      build: {
        outDir: distClient,
        emptyOutDir: true,
        ssrManifest: true,
      },
    }

    const serverBuildOptions: vite.InlineConfig = {
      ...vc,
      build: {
        emptyOutDir: true,
        outDir: distServer,
        ssr: true,
        rollupOptions: {
          preserveEntrySignatures: "allow-extension", // not required
          input: require.resolve("@factor/api/entry/mount.ts"),
          output: { format: "es" },
        },
      },
    }

    await Promise.all([
      vite.build(clientBuildOptions),
      vite.build(serverBuildOptions),
    ])

    logger.info("buildApp", "[done] application built successfully")

    await generateSitemap(options)

    if (prerender) {
      await preRender(options)
    }
  } catch (error) {
    logger.error("buildApp", "[error] failed to build application", { error })
  }

  return
}
