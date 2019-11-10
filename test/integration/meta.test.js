import { getPort, loadFixture } from "@test/utils"
import { createServer, renderRoute, closeServer } from "@factor/server"

let port
describe("Meta", () => {
  beforeAll(async () => {
    await loadFixture("@test/meta")
    port = await getPort()
    await createServer({ port })
  })

  test("/basic", async () => {
    const html = await renderRoute({ url: "/basic" })

    expect(html).toContain("<title>title template</title>")
    expect(html).toContain("this is the description")
    expect(html).toContain('lang="en"')
    expect(html).toContain("amp")
  })

  test("/mutation", async () => {
    const html = await renderRoute({ url: "/mutation" })
    expect(html).toContain("<title>change-title</title>")
    expect(html).toContain("change-description")
  })

  test("/async", async () => {
    const html = await renderRoute({ url: "/async" })

    expect(html).toContain("<title>async-title</title>")
    expect(html).toContain("async-description")
  })

  // Close server and ask to stop listening to file changes
  afterAll(async () => {
    await closeServer()
  })
})
