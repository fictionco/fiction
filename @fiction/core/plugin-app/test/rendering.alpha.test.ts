import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { Request } from 'express'
import type { TestUtils } from '../../test-utils/init'
import { createTestUtils } from '../../test-utils/init'

let testUtils: undefined | TestUtils
describe('rendering tests', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
  })

  it('generates correct html', async () => {
    const html = testUtils?.fictionApp?.fictionRender?.addRunVarsToHtml({ html: '<html><body>hello</body></html>', runVars: { test: '123' } })

    expect(html).toMatchInlineSnapshot(`
      "<html><body>hello<script id="fictionRun" type="application/json">{"test":"123"}</script>
      </body></html>"
    `)

    expect(html).toContain('id="fictionRun"')
    expect(html).toContain('type="application/json"')
  })

  it('generates correct request variables', () => {
    if (!testUtils)
      return
    // Mock the Request object
    const mockRequest = {
      protocol: 'https',
      subdomains: ['api', 'test'],
      get: vi.fn((header) => {
        if (header === 'host')
          return 'example.com:3000'
        if (header === 'User-Agent')
          return 'Mozilla/5.0'
      }),
      ip: '192.168.1.1',
      hostname: 'api.test.example.com',
      originalUrl: '/path',
    } as unknown as Request

    // Mock `getRenderedEnvVars` function
    vi.spyOn(testUtils?.fictionEnv, 'getRenderedEnvVars').mockReturnValue({})

    // Call `getRequestVars` function
    const requestVars = testUtils?.fictionApp?.fictionRender?.getRequestVars({ request: mockRequest })

    // Assertions
    expect(requestVars).toBeDefined()
    expect(requestVars?.PROTOCOL).toBe('https')
    expect(requestVars?.SUBDOMAIN).toBe('api.test')
    expect(requestVars?.HOST).toBe('example.com:3000')
    expect(requestVars?.IP_ADDRESS).toBe('192.168.1.1')
    expect(requestVars?.USER_AGENT).toBe('Mozilla/5.0')
    expect(requestVars?.HOSTNAME).toBe('api.test.example.com')
    expect(requestVars?.PATHNAME).toBe('/path')
  })
})
