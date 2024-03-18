import type { TestUtils } from '@fiction/core/test-utils'
import { createTestUtils } from '@fiction/core/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FictionRender } from '../plugin-render'

let testUtils: TestUtils
let fictionRender: FictionRender

const template = `<!DOCTYPE html><html>
<head><!--head--></head>
<body><div id="app"><!--app--></div></body>
</html>`

const renderHtmlParams = {
  pathname: '/',
  template,
  isProd: true,
  runVars: {},
  manifest: {},
}

describe('serverRenderHtml', () => {
  // Mock external dependencies
  const mockServerRenderApp = vi.fn().mockResolvedValue({
    bodyAttrs: 'foo="bar"',
    preloadLinks: '<preloadLinks></preloadLinks>',
    headTags: '<headtags></headtags>',
    htmlAttrs: 'bar="foo"',
    bodyTags: '<bodyTags></bodyTags>',
    bodyTagsOpen: '<bodyTagsOpen></bodyTagsOpen>',
    htmlBody: '<htmlBody></htmlBody>',
  })
  beforeAll(async () => {
    testUtils = createTestUtils()
    if (!testUtils.fictionApp.fictionRender)
      throw new Error('no fictionRender')

    fictionRender = testUtils.fictionApp.fictionRender

    fictionRender.serverRenderApp = mockServerRenderApp
  })

  beforeEach(() => {
    // Reset mocks before each test
    mockServerRenderApp.mockClear()
  })

  it('should construct the correct HTML when valid inputs are provided', async () => {
    // Set up your input params
    const params = { ...renderHtmlParams }

    // Execute the function
    const html = await fictionRender.serverRenderHtml(params)

    // Assert the results
    expect(html.replace(testUtils.fictionApp.port.toString(), 'PORT')).toMatchInlineSnapshot(`"<!DOCTYPE html><html bar="foo"><head><headtags></headtags><preloadlinks></preloadlinks><link href="http://localhost:PORT" rel="canonical"><meta name="generator" content="FictionJS 6.0.4"></head><body foo="bar"><bodytagsopen></bodytagsopen><div id="app"><htmlbody></htmlbody></div><bodytags></bodytags><!--{"renderedPathname":"/","isProd":true}--></body></html>"`)
    expect(html).toContain('<headtags></headtags>'.toLowerCase())
    expect(html).toContain('<htmlBody></htmlBody>'.toLowerCase())
    expect(html).toContain('foo="bar"')
    expect(html).toContain('bar="foo"')
    expect(html).toContain('<bodyTagsOpen></bodyTagsOpen>'.toLowerCase())
    expect(html).toContain('<bodyTags></bodyTags>'.toLowerCase())
    expect(html).toContain('<bodyTags></bodyTags>'.toLowerCase())
  })
})
