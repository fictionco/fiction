import { RenderOptions } from "@factor/types"

import { serveApp } from "./serve"

export * from "./build"
export * from "./prerender"
export * from "./serve"

/**
 * Run the application build
 */
export const setup = async (options: RenderOptions): Promise<void> => {
  await serveApp(options)

  return
}
