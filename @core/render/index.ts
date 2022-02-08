import { CliOptions } from "@factor/cli/program"

import { serveApp } from "./serve"

export * from "./build"
export * from "./prerender"
export * from "./serve"

/**
 * Run the application build
 */
export const setup = async (options: CliOptions): Promise<void> => {
  await serveApp(options)

  return
}
