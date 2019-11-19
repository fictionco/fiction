import { getPort, loadFixture } from "@test/utils"
import { createRenderServer, renderRoute, closeServer } from "@factor/server"

let port
describe("Meta", () => {
  beforeAll(async () => {
    await loadFixture("@test/meta")
    port = await getPort()
    await createRenderServer({ port })
  })

  // Close server and ask to stop listening to file changes
  afterAll(async () => {
    await closeServer()
  })

  test("/basic", async () => {
    const html = await renderRoute("/basic")

    expect(html).toContain("<title>title template</title>")
    expect(html).toContain("this is the description")
    expect(html).toContain('lang="en"')
    expect(html).toContain("amp")
  })

  test("/mutation", async () => {
    const html = await renderRoute("/mutation")
    expect(html).toContain("<title>change-title</title>")
    expect(html).toContain("change-description")
  })

  test("/async", async () => {
    const html = await renderRoute("/async")

    expect(html).toContain("<title>async-title</title>")
    expect(html).toContain("async-description")
  })
})
