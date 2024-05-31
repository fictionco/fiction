import { createTestUtils } from '@fiction/core/test-utils'

import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the SSR module before importing it
const mockRender = vi.fn().mockResolvedValue({
  htmlBody: '<htmlbody></htmlbody>',
  headTags: '<headtags></headtags>',
  bodyTags: '<bodytags></bodytags>',
  bodyAttrs: 'class="test"',
  htmlAttrs: 'lang="en"',
  bodyTagsOpen: '<bodytagsopen></bodytagsopen>',
})

vi.mock('../render/ssr', () => {
  return {
    SSR: vi.fn().mockImplementation(() => {
      return { render: mockRender }
    }),
  }
})

const template = `<!DOCTYPE html><html>
<head><!--head--></head>
<body><div id="app"><!--app--></div></body>
</html>`

describe('serverRenderHtml', async () => {
  const testUtils = createTestUtils()
  const fictionRender = testUtils.fictionApp.fictionRender

  if (!fictionRender)
    throw new Error('fictionRender is not defined')

  afterAll(() => testUtils.close())

  const ssr = await fictionRender.getSSR('test')
  const renderHtmlParams = {
    pathname: '/',
    template,
    mode: 'prod',
    runVars: {},
    ssr,
  } as const

  beforeEach(() => {
    mockRender.mockClear()
  })

  it('should construct the correct HTML when valid inputs are provided', async () => {
    if (!fictionRender)
      throw new Error('fictionRender is not defined')

    const html = await fictionRender.serverRenderHtml(renderHtmlParams)

    expect(mockRender).toHaveBeenCalled()
    expect(html).toContain('lang="en"')
    expect(html).toContain('class="test"')
    expect(html).toContain('<headtags></headtags>')
    expect(html).toContain('<htmlbody></htmlbody>')
    expect(html).toContain('<bodytagsopen></bodytagsopen>')
    expect(html).toContain('<bodytags></bodytags>')
    expect(html).toMatch(/<meta name="generator" content="Fiction \d+\.\d+\.\d+">/)
    expect(html).toContain(`<!--{"renderedPathname":"/","mode":"prod"}-->`)
  })
})
