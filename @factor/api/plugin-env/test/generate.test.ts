import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import fs from "fs-extra"
import { safeDirname } from "@factor/api/utils"
import { generateStaticConfig } from "@factor/api/plugin-env/generate"
import { createTestUtils } from "@factor/api/testUtils"
const root = new URL(".", import.meta.url).pathname
describe("test config generator", () => {
  beforeAll(async () => {
    const testUtils = await createTestUtils({
      cwd: safeDirname(import.meta.url),
    })

    testUtils.factorEnv.addHook({
      hook: "staticConfig",
      callback: async (schema) => {
        const test = ["test"]

        const staticConfig = {
          ...schema,
          test,
        }

        return staticConfig
      },
    })

    await generateStaticConfig(testUtils.factorEnv)
  })
  it("generates into correct folder", async () => {
    expect(fs.existsSync(path.join(root, "/.factor"))).toBe(true)
  })

  it("has hooked data", async () => {
    const config = await import("./.factor/config.json")
    expect(config.test[0]).toBe("test")
  })
})
