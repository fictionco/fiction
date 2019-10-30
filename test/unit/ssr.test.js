import { loadFixture, getPort } from "@test/utils"
let Factor
let port
describe("SSR", () => {
  beforeAll(async () => {
    Factor = await loadFixture("@test/ssr")
    port = await getPort()
    await Factor.$server.createServer({ port })
  })

  test("/basic", async () => {
    const html = await Factor.$server.renderRoute({ url: "/basic" })
    expect(html).toContain("<h1>Basic</h1>")
  })

  test("/mutation", async () => {
    const html = await Factor.$server.renderRoute({ url: "/mutation" })
    expect(html).toContain("<h1>mutated</h1>")
  })

  test("/store-data", async () => {
    const html = await Factor.$server.renderRoute({ url: "/store-data" })
    expect(html).toContain("<h1>loaded</h1>")
  })

  // Close server and ask nuxt to stop listening to file changes
  afterAll(async () => {
    await Factor.$server.closeServer()
  })
})
