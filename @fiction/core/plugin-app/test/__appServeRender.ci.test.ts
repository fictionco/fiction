import { createRequire } from 'node:module'
import path from 'node:path'

import type playwright from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { TestServerConfig } from '@fiction/core/test-utils/buildTest'
import { createTestServer } from '@fiction/core/test-utils/buildTest'
import { commands } from '@fiction/www/src/vars'

const require = createRequire(import.meta.url)
const cwd = path.dirname(require.resolve('@fiction/www/package.json'))
let testServer: TestServerConfig | undefined

function page(): playwright.Page {
  if (!testServer?.page)
    throw new Error('no app page')
  return testServer?.page ?? ''
}
describe('renders app code correctly', () => {
  beforeAll(async () => {
    testServer = await createTestServer({ cwd, headless: true, commands })
  }, 20_000)

  afterAll(async () => {
    await testServer?.destroy()
  })

  it('handles defined globals', async () => {
    if (!testServer)
      throw new Error('no test server')

    const serverPort = testServer.commands.find(_ => _.command === 'server')?.port.value ?? 0
    const appPort = testServer.commands.find(_ => _.command === 'app')?.port.value ?? 0

    function url(route: string): string {
      return `http://localhost:${appPort}${route}`
    }

    await page().goto(url('/testing'))

    await page().waitForSelector('#server-port')

    const serverUrlText = await page().locator(`#server-port`).textContent()
    expect(serverUrlText).toBe(serverPort.toString())

    const currentUrlText = await page().locator(`#app-port`).textContent()
    expect(currentUrlText).toBe(String(appPort))

    const appNameText = await page().locator(`#app-name`).textContent()
    expect(appNameText).toMatchInlineSnapshot('"FactorJS"')

    const appEmailText = await page().locator(`#app-email`).textContent()
    expect(appEmailText).toMatchInlineSnapshot('"hi@fictionjs.org"')
  }, 20_000)
})
