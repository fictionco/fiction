import { loadFixture, getPort } from "@test/utils"
let Factor
let port
describe("plugin-import", () => {
  beforeAll(async () => {
    Factor = await loadFixture("@test/importer")
    port = await getPort()
    await Factor.$server.createServer({ port })
  })

  // Close server and ask nuxt to stop listening to file changes
  afterAll(async () => {
    await Factor.$server.closeServer()
  })

  it("loads plugins on server", async () => {
    expect(Factor.$cwd.data).toContain("server-class-added")
  })

  // TODO verify client side loading of plugins works correctly
  // needs a renderWindow utility method (create with JSDOM)
})
