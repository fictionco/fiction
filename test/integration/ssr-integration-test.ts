import { loadFixture, getPort } from "@test/utils"
import { createRenderServer, renderRoute, closeServer } from "@factor/server"
import { BundleRenderer } from "vue-server-renderer"
let port: string
let renderer: BundleRenderer

describe("ssr-integration", () => {
  beforeAll(async () => {
    process.env.NODE_ENV == "production"
    await loadFixture("@test/ssr")
    port = await getPort()
    renderer = await createRenderServer({ port })
  })

  test("/basic", async () => {
    const html = await renderRoute("/basic", renderer)
    expect(html).toContain("<h1>Basic</h1>")
  })

  test("/mutation", async () => {
    const html = await renderRoute("/mutation", renderer)
    expect(html).toContain("<h1>mutated</h1>")
  })

  test("/store-data", async () => {
    const html = await renderRoute("/store-data", renderer)
    expect(html).toContain("<h1>loaded</h1>")
  })

  // Close server + stop listening to file changes
  afterAll(async () => {
    await closeServer()
  })
})
