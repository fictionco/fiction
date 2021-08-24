import { RenderOptions } from "@factor/types"
import * as vite from "vite"

import { getViteConfig } from "./vite.config"

let __viteDevServer: vite.ViteDevServer
export const getViteServer = async (
  options: Partial<RenderOptions> = {},
): Promise<vite.ViteDevServer> => {
  if (!__viteDevServer) {
    const server: vite.ServerOptions = {
      middlewareMode: "ssr",
      force: options.force,
    }

    const config = getViteConfig({ server, ...options })

    __viteDevServer = await vite.createServer(config)
  }

  return __viteDevServer
}
