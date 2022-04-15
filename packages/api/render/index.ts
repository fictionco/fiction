import type { RunConfig } from "../cli/utils"

import { serveApp } from "./serve"

export * from "./build"
export * from "./prerender"
export * from "./serve"

/**
 * Run the application build
 */
export const setup = async (options: RunConfig): Promise<void> => {
  await serveApp(options)

  return
}
