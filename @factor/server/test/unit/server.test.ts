import { dirname } from "path"
import { createRenderServer, closeServer } from "@factor/server"
import { generateBundles } from "@factor/build/webpack-config"

import { getUrl, getPort } from "@test/utils"
import axios from "axios"

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
      await generateBundles()
    } catch (error) {
      throw new Error(error)
    }

    await createRenderServer()

    const theUrl = getUrl({ route: "/", port: process.env.PORT })

    const doc = await axios.get(theUrl)

    expect(doc.data).toContain("::hello::")
    expect(doc.headers["content-type"]).toContain("text/html")
  })
})
