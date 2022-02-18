import { createRequire } from "module"

const require = createRequire(import.meta.url)

export const startUnitTestRunner = async (): Promise<void> => {
  const { createVitest } = await import("vitest/node")
  const ctx = await createVitest({
    config: require.resolve("./vitest.config.ts"),
  })
  await ctx.start()
}

export * from "./utils"
export * from "./vitest.config"
