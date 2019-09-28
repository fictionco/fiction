import { resolve, join } from "path"
import { loadFixture } from "../utils/build"
import { getPort, waitFor } from "../utils"
let Factor
describe("SSR", () => {
  beforeAll(async () => {
    Factor = await loadFixture("@test/cli")
    process.env.PORT = await getPort()
    await Factor.$filters.run("create-server")
  })
  test("basic ssr route", async () => {
    const { html } = await Factor.$utils.renderRoute("/basic")
    expect(html).toContain("<h1>Basic</h1>")
  })

  // Close server and ask nuxt to stop listening to file changes
  afterAll(async () => {
    await Factor.$filters.run("close-server")
  })
})
