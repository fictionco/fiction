import http from "http"
import { it, describe, expect, beforeAll, afterAll } from "vitest"

import { chromium, Browser, Page } from "playwright"
import { FactorTestingApp } from ".."
let server: http.Server | undefined = undefined
let browser: Browser | undefined = undefined
let page: Page | undefined = undefined
const port = 1234
describe("spa test app server", () => {
  beforeAll(async () => {
    const testingApp = new FactorTestingApp({
      port,
      head: `<meta name="author" content="John Doe">`,
      mode: "development",
    })
    server = await testingApp.createApp()
    browser = await chromium.launch()
    page = await browser?.newPage()
  })
  afterAll(async () => {
    server?.close()
    await browser?.close()
  })
  it("runs server", async () => {
    await page?.goto(`http://localhost:${port}`)
    const ht = await page?.content()
    expect(server).toBeDefined()
    expect(ht).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html lang=\\"en\\"><head>
      <meta charset=\\"utf-8\\">
      <title>Error</title>
      </head>
      <body>
      <pre>Error: Failed to parse source for import analysis because the content contains invalid JS syntax. Install @vitejs/plugin-vue to handle .vue files.<br> &nbsp; &nbsp;at formatError (file:///Users/arpowers/Projects/factor/node_modules/.pnpm/vite@3.0.3_less@4.1.3/node_modules/vite/dist/node/chunks/dep-c6273c7a.js:35035:46)<br> &nbsp; &nbsp;at TransformContext.error (file:///Users/arpowers/Projects/factor/node_modules/.pnpm/vite@3.0.3_less@4.1.3/node_modules/vite/dist/node/chunks/dep-c6273c7a.js:35031:19)<br> &nbsp; &nbsp;at TransformContext.transform (file:///Users/arpowers/Projects/factor/node_modules/.pnpm/vite@3.0.3_less@4.1.3/node_modules/vite/dist/node/chunks/dep-c6273c7a.js:40107:22)<br> &nbsp; &nbsp;at async Object.transform (file:///Users/arpowers/Projects/factor/node_modules/.pnpm/vite@3.0.3_less@4.1.3/node_modules/vite/dist/node/chunks/dep-c6273c7a.js:35284:30)<br> &nbsp; &nbsp;at async loadAndTransform (file:///Users/arpowers/Projects/factor/node_modules/.pnpm/vite@3.0.3_less@4.1.3/node_modules/vite/dist/node/chunks/dep-c6273c7a.js:39803:29)</pre>


      </body></html>"
    `)
    expect(ht).toContain("John Doe")
    expect(ht?.length).toBeGreaterThan(100)
  })
})
