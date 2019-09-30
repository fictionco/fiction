import { resolve, join } from "path"
import { loadFixture } from "../utils/build"
import { getPort, waitFor } from "../utils"
let Factor
let port
describe("Meta", () => {
  beforeAll(async () => {
    Factor = await loadFixture("@test/meta")
    port = await getPort()
    await Factor.$server.createServer({ port })
  })

  test("/basic", async () => {
    const html = await Factor.$server.renderRoute({ url: "/basic" })

    expect(html).toContain("<title>title template</title>")
    expect(html).toContain("this is the description")
    expect(html).toContain(`lang="en"`)
    expect(html).toContain(`amp`)
  })

  test("/mutation", async () => {
    const html = await Factor.$server.renderRoute({ url: "/mutation" })
    expect(html).toContain("<title>change-title</title>")
    expect(html).toContain("change-description")
  })

  test("/async", async () => {
    const html = await Factor.$server.renderRoute({ url: "/async" })

    expect(html).toContain("<title>async-title</title>")
    expect(html).toContain("async-description")
  })

  // test("/store-data", async () => {
  //   const html = await Factor.$server.renderRoute({ url: "/store-data" })
  //   expect(html).toContain("<h1>loaded</h1>")
  // })

  // Close server and ask nuxt to stop listening to file changes
  afterAll(async () => {
    await Factor.$server.closeServer()
  })
})
