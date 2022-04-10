import * as vite from "vite"
import { RenderOptions } from "../types"

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

    const config = await getViteConfig({ server, ...options })

    __viteDevServer = await vite.createServer(config)
  }

  return __viteDevServer
}
