import { it, describe, expect, beforeAll, afterAll } from "vitest"
import { ViteDevServer } from "vite"
import { chromium, Browser, Page } from "playwright"
import { createTestApp } from "../run"

let server: ViteDevServer | undefined = undefined
let browser: Browser | undefined = undefined
let page: Page | undefined = undefined
const port = 1234
describe("spa test app server", () => {
  beforeAll(async () => {
    server = await createTestApp({
      port,
      head: `<meta name="author" content="John Doe">`,
    })
    browser = await chromium.launch()
    page = await browser?.newPage()
  })
  afterAll(async () => {
    await server?.close()
    await browser?.close()
  })
  it("runs server", async () => {
    await page?.goto(`http://localhost:${port}`)
    const ht = await page?.content()
    expect(server).toBeDefined()
    expect(ht).toContain("John Doe")
    expect(ht?.length).toBeGreaterThan(100)
  })
})
