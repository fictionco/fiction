import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import fs from "fs-extra"
import { UserConfig } from "../../types"
import { generateStaticConfig } from "../generate"
import { setUserConfig } from "../plugins"

const root = new URL(".", import.meta.url).pathname
describe("test config generator", () => {
  beforeAll(async () => {
    const config: UserConfig = await setUserConfig(
      {
        root,
        hooks: [
          {
            hook: "staticConfig",
            callback: async (schema) => {
              const test = ["test"]

              const staticConfig = {
                ...schema.staticConfig,
                test,
              }

              schema.staticSchema.properties = {
                ...schema.staticSchema.properties,
                test: {
                  enum: test,
                  type: "string",
                },
              }

              return { ...schema, staticConfig }
            },
          },
        ],
      },
      {
        isServer: true,
      },
    )

    await generateStaticConfig(config)
  })
  it("generates into correct folder", async () => {
    expect(fs.existsSync(path.join(root, "/.factor"))).toBe(true)
  })

  it("has hooked data", async () => {
    const config = await import("./.factor/config.json")
    expect(config.test[0]).toBe("test")
  })
})
