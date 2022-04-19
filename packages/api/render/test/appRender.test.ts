import { createRequire } from "module"
import path from "path"
import { Page } from "playwright"
import { describe, it, beforeAll, expect, afterAll } from "vitest"
import * as mainFile from "@factor/site"
import { createTestServer, TestServerConfig } from "../../test-utils"
const require = createRequire(import.meta.url)
let _s: TestServerConfig | undefined = undefined

const url = (route: string): string => {
  if (!_s?.appUrl) throw new Error("no app url")
  return `${_s.appUrl}${route}`
}

const page = (): Page => {
  if (!_s?.page) throw new Error("no app page")
  return _s?.page ?? ""
}
describe("renders app code correctly", () => {
  beforeAll(async () => {
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    _s = await createTestServer({
      cwd,
      headless: false,
    })
  }, 15_000)

  afterAll(async () => {
    await _s?.destroy()
  })

  it("handles defined globals", async () => {
    if (!_s) throw new Error("no test server")

    await page().goto(url("/testing"))

    await page().waitForSelector("#server-url")

    const mainConfig = mainFile.setup()

    const serverUrlText = await page().locator(`#server-url`).textContent()
    expect(serverUrlText).toBe(_s.serverUrl.toString())

    const currentUrlText = await page().locator(`#current-url`).textContent()
    expect(currentUrlText).toBe(_s.appUrl)

    const appNameText = await page().locator(`#app-name`).textContent()
    expect(appNameText).toBe(mainConfig?.variables?.FACTOR_APP_NAME)

    const appEmailText = await page().locator(`#app-email`).textContent()
    expect(appEmailText).toBe(mainConfig?.variables?.FACTOR_APP_EMAIL)

    const appUrlText = await page().locator(`#app-url`).textContent()
    expect(appUrlText).toBe(mainConfig?.variables?.FACTOR_APP_URL)
  }, 16_000)
})
