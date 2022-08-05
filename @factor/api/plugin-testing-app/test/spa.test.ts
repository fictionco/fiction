import http from "http"
import { it, describe, expect, beforeAll, afterAll } from "vitest"

import { chromium, Browser, Page } from "playwright"
import { createTestUtilServices } from "../../testUtils"
import { FactorTestingApp } from ".."
let server: http.Server | undefined = undefined
let browser: Browser | undefined = undefined
let page: Page | undefined = undefined
const port = 1234
describe("spa test app server", () => {
  beforeAll(async () => {
    const testUtils = await createTestUtilServices()
    const testingApp = new FactorTestingApp({
      factorEnv: testUtils.factorEnv,
      port,
      head: `<meta name="author" content="John Doe">`,
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

    expect(ht).toContain("John Doe")
    expect(ht?.length).toBeGreaterThan(100)
  })
})
