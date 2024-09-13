import type { TestUtils } from '@fiction/core/test-utils/init'
import type * as vite from 'vite'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { beforeAll, describe, expect, it } from 'vitest'

let viteConfig: vite.InlineConfig | undefined
let testUtils: TestUtils | undefined
describe('vite config', () => {
  beforeAll(async () => {
    testUtils = createTestUtils({ serverPort: 20_220, appPort: 1234 })
  })
  it('gets and merges vite config', async () => {
    expect(testUtils?.fictionServer.port.value).toBe(20_220)

    viteConfig = await testUtils?.fictionApp.fictionRender?.getViteConfig({ mode: 'prod' })

    expect(viteConfig).toBeTruthy()

    expect(viteConfig?.define).toMatchInlineSnapshot(`
      {
        "global": {},
      }
    `)
    expect(Object.keys(viteConfig ?? {})).toMatchInlineSnapshot(`
      [
        "mode",
        "root",
        "ssr",
        "server",
        "define",
        "build",
        "plugins",
        "optimizeDeps",
        "logLevel",
        "resolve",
        "publicDir",
        "css",
      ]
    `)
  })
})
