import { createRequire } from "module"
import path from "path"

import {
  createTestServer,
  TestServerConfig,
  describe,
  it,
  beforeAll,
  expect,
  afterAll,
  playwright,
} from "@factor/api/testUtils"
const require = createRequire(import.meta.url)
let _s: TestServerConfig | undefined = undefined

const url = (route: string): string => {
  return `http://localhost:${_s?.appPort}${route}`
}

const page = (): playwright.Page => {
  if (!_s?.page) throw new Error("no app page")
  return _s?.page ?? ""
}
describe("renders app code correctly", () => {
  beforeAll(async () => {
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    _s = await createTestServer({ cwd, headless: false })
  }, 8000)

  afterAll(async () => {
    await _s?.destroy()
  })

  it("handles defined globals", async () => {
    if (!_s) throw new Error("no test server")

    await page().goto(url("/testing"))

    await page().waitForSelector("#server-port")

    const serverUrlText = await page().locator(`#server-port`).textContent()
    expect(serverUrlText).toBe(_s.serverPort.toString())

    const currentUrlText = await page().locator(`#app-port`).textContent()
    expect(currentUrlText).toBe(String(_s.appPort))

    const appNameText = await page().locator(`#app-name`).textContent()
    expect(appNameText).toMatchInlineSnapshot('"FactorJS"')

    const appEmailText = await page().locator(`#app-email`).textContent()
    expect(appEmailText).toMatchInlineSnapshot('"hi@factorjs.org"')
  }, 30_000)
})
