import { describe, expect, it } from 'vitest'
import { createProxyUrl, reverseProxyUrl } from '../utils'

describe('proxy url handling', () => {
  it('creates correct url', () => {
    const proxyUrl = 'http://localhost:2233?url=special'
    const clientUrl = 'https://www.homedepot.com'
    const proxyClientUrl1 = createProxyUrl({
      clientUrl,
      proxyUrl,
    })

    expect(proxyClientUrl1).toMatchInlineSnapshot(
      '"http://localhost:2233?url=_https_www--homedepot--com"',
    )

    const url1 = reverseProxyUrl({ proxyHost: proxyClientUrl1, pathname: '/' })
    expect(url1).toMatchInlineSnapshot('"https://www.homedepot.com"')
    expect(url1).toBe(clientUrl)

    const clientUrl2 = 'http://localhost:8888'

    const proxyClientUrl2 = createProxyUrl({
      clientUrl: clientUrl2,
      proxyUrl,
    })

    expect(proxyClientUrl2).toMatchInlineSnapshot(
      '"http://localhost:2233?url=_http_localhost__8888"',
    )

    const url2 = reverseProxyUrl({ proxyHost: proxyClientUrl2, pathname: '/' })
    expect(url2).toMatchInlineSnapshot('"http://localhost:8888"')
    expect(url2).toBe(clientUrl2)

    const proxyUrl3 = 'http://special.kaption.org'
    const clientUrl3 = 'https://test.apple.com'
    const proxyClientUrl3 = createProxyUrl({
      clientUrl: clientUrl3,
      proxyUrl: proxyUrl3,
    })

    expect(proxyClientUrl3).toMatchInlineSnapshot(
      '"http://_https_test--apple--com.kaption.org"',
    )

    const url3 = reverseProxyUrl({ proxyHost: proxyClientUrl3, pathname: '/' })
    expect(url3).toMatchInlineSnapshot('"https://test.apple.com"')
    expect(url3).toBe(clientUrl3)

    const proxyUrl4 = 'http://special.localhost:2233'
    const clientUrl4 = 'https://www.homedepot.com'
    const proxyClientUrl4 = createProxyUrl({
      clientUrl: clientUrl4,
      proxyUrl: proxyUrl4,
    })

    expect(proxyClientUrl4).toMatchInlineSnapshot(
      '"http://_https_www--homedepot--com.localhost:2233"',
    )

    const url4 = reverseProxyUrl({ proxyHost: proxyClientUrl4, pathname: '/' })
    expect(url4).toMatchInlineSnapshot('"https://www.homedepot.com"')
    expect(url4).toBe(clientUrl4)
  })
})
