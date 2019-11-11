import { loadFixture, getPort } from "@test/utils"
import { createServer, renderRoute, closeServer } from "@factor/server"

let port
describe("SSR", () => {
  beforeAll(async () => {
    await loadFixture("@test/ssr")
    port = await getPort()
    await createServer({ port })
  })

  test("/basic", async () => {
    const html = await renderRoute("/basic")
    expect(html).toContain("<h1>Basic</h1>")
  })

  test("/mutation", async () => {
    const html = await renderRoute("/mutation")
    expect(html).toContain("<h1>mutated</h1>")
  })

  test("/store-data", async () => {
    const html = await renderRoute("/store-data")
    expect(html).toContain("<h1>loaded</h1>")
  })

  // Close server + stop listening to file changes
  afterAll(async () => {
    await closeServer()
  })
})
