import { createRenderServer, closeServer } from "@factor/server"
import { dirname } from "path"
import { generateBundles } from "@factor/build/webpack-config"
import { generateLoaders } from "@factor/cli/extension-loader"
import { getUrl, getPort } from "@test/utils"
import axios from "axios"
import log from "@factor/tools/logger"
describe("server", () => {
  afterAll(async () => {
    await closeServer()
    jest.resetModules()
  })

  it("creates a production server", async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("./test-files/package.json"))
    process.env.PORT = await getPort()
    process.env.NODE_ENV = "production"

    try {
      generateLoaders()
      await generateBundles()
    } catch (error) {
      throw new Error(error)
    }

    await createRenderServer()

    const theUrl = getUrl({ route: "/", port: process.env.PORT })

    let doc = await axios.get(theUrl)

    expect(doc.data).toContain("::hello::")
    expect(doc.headers["content-type"]).toContain("text/html")
  })

  // it("adds extended middleware", async () => {
  //   const theUrl = getUrl({ route: "/favicon.ico", port: process.env.PORT })

  //   let doc
  //   try {
  //     doc = await axios.get(theUrl)
  //   } catch (error) {
  //     throw new Error(error)
  //   }

  //   console.log("DOC", doc)
  // })
  it.todo("adds compression middleware")
  it.todo("adds logging middleware")
  it.todo("serves static assets")
  it.todo("handles errors")
})
