import { createRenderServer } from "@factor/server"
import { dirname } from "path"
import { generateBundles } from "@factor/build/webpack-config"
import { generateLoaders } from "@factor/cli/extension-loader"
import { rp, waitFor, getUrl } from "@test/utils"
describe("server", () => {
  beforeAll(() => {})

  it("creates a production server", async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("./test-files/package.json"))
    process.env.PORT = String(7777)
    process.env.NODE_ENV = "production"

    try {
      generateLoaders()
      await generateBundles()
    } catch (error) {
      throw new Error(error)
    }

    createRenderServer()

    waitFor(200)

    const theUrl = getUrl({ route: "/", port: process.env.PORT })

    let html
    try {
      html = await rp(theUrl)
    } catch (error) {
      throw new Error(error)
    }

    expect(html).toContain("::hello::")
  })
  it.todo("sets correct headers")
  it.todo("listens on the correct port")
  it.todo("starts development server")
  it.todo("starts production server")
  it.todo("adds extended middleware")
  it.todo("adds compression middleware")
  it.todo("adds logging middleware")
  it.todo("serves static assets")
  it.todo("handles errors")
})
