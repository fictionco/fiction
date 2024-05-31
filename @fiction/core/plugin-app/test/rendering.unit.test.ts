import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { Request } from 'express'
import type { TestUtils } from '../../test-utils/init'
import { createTestUtils } from '../../test-utils/init'

let testUtils: undefined | TestUtils
describe('rendering tests', () => {
  beforeAll(async () => {
    testUtils = createTestUtils()
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

  it('generates correct request variables including ORIGINAL_SUBDOMAIN and ALL_HEADERS', () => {
    if (!testUtils)
      return

    const ohost = 'whatever.com'
    // Mock the Request object
    const headers = {
      'host': 'example.com:3000',
      'User-Agent': 'Mozilla/5.0',
      'X-Original-Host': ohost,
      'Custom-Header': 'value123',
    }
    const mockRequest = {
      protocol: 'https',
      subdomains: ['api', 'test'],
      headers,
      get(header: keyof typeof headers) {
        return headers[header]
      },
      ip: '192.168.1.1',
      hostname: 'api.test.example.com',
      originalUrl: '/path',
    } as unknown as Request

    // Mock `getRenderedEnvVars` function
    vi.spyOn(testUtils?.fictionEnv, 'getRenderedEnvVars').mockReturnValue({})

    // Call `getRequestVars` function
    const requestVars = testUtils?.fictionApp?.fictionRender?.getRunVars({ request: mockRequest, mode: 'test' })

    // Assertions for basic request variables
    expect(requestVars).toBeDefined()
    expect(requestVars?.PROTOCOL).toBe('https')
    expect(requestVars?.SUBDOMAIN).toBe('api.test')
    expect(requestVars?.HOST).toBe('example.com:3000')
    expect(requestVars?.IP_ADDRESS).toBe('192.168.1.1')
    expect(requestVars?.USER_AGENT).toBe('Mozilla/5.0')
    expect(requestVars?.HOSTNAME).toBe('api.test.example.com')
    expect(requestVars?.PATHNAME).toBe('/path')
    expect(requestVars?.ORIGINAL_HOST).toBe('whatever.com')

    expect(requestVars?.ALL_HEADERS).toContain('host: example.com:3000')
    expect(requestVars?.ALL_HEADERS).toContain('User-Agent: Mozilla/5.0')
    expect(requestVars?.ALL_HEADERS).toContain(`X-Original-Host: ${ohost}`)
    expect(requestVars?.ALL_HEADERS).toContain('Custom-Header: value123')
  })
})
