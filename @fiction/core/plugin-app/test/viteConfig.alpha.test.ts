import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { beforeAll, describe, expect, it } from 'vitest'
import type * as vite from 'vite'

let viteConfig: vite.InlineConfig | undefined
let testUtils: TestUtils | undefined
describe('vite config', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils({ serverPort: 20_220, appPort: 1234 })
  })
  it('gets and merges vite config', async () => {
    expect(testUtils?.factorServer.port).toBe(20_220)

    viteConfig = await testUtils?.factorApp.factorRender?.getViteConfig({
      isProd: true,
    })

    expect(viteConfig).toBeTruthy()

    expect(viteConfig?.define).toMatchInlineSnapshot('undefined')
    expect(Object.keys(viteConfig ?? {})).toMatchInlineSnapshot(`
      [
        "mode",
        "root",
        "ssr",
        "server",
        "build",
        "resolve",
        "plugins",
        "optimizeDeps",
        "logLevel",
        "publicDir",
        "css",
      ]
    `)
  })
})
