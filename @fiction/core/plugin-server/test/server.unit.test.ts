/**
 * @vitest-environment happy-dom
 */
import type http from 'node:http'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { axios, randomBetween, vue } from '@fiction/core/utils'
import type { EndpointResponse } from '@fiction/core/types'
import { FictionUser } from '@fiction/core/plugin-user'
import { FictionServer } from '..'

let testUtils: TestUtils
let server: http.Server | undefined
describe('server test', () => {
  beforeAll(async () => {
    testUtils = createTestUtils()
  })

  afterEach(() => {
    server?.close()
  })
  it('starts endpoint server', async () => {
    const port = randomBetween(9000, 9999)
    const fictionServer = new FictionServer({
      fictionEnv: testUtils.fictionEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
    })

    server = await fictionServer.createServer()

    expect(fictionServer.port.value).toBe(port)

    expect(fictionServer.serverUrl.value).toBe(`http://localhost:${port}`)

    let response: axios.AxiosResponse<EndpointResponse> | undefined
    try {
      response = await axios.default.get<EndpointResponse>(
        `http://localhost:${fictionServer.port.value}/api/health`,
      )
    }
    catch (error) {
      console.error(error)
    }

    expect(response?.data.status).toBe('success')
    expect(response?.data.message).toBe('ok')
    expect(response?.status).toBe(200)

    expect(Object.keys(response?.data || {})).toMatchInlineSnapshot(`
      [
        "status",
        "message",
        "duration",
        "timestamp",
        "memoryUsage",
        "cpuUsage",
        "loadAverage",
        "environment",
        "requestCount",
        "activeConnections",
      ]
    `)
  })

  it('switches to live URL correctly', async () => {
    const port = randomBetween(9000, 9999)
    const fictionServer = new FictionServer({
      fictionEnv: testUtils.fictionEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true), // Simulating live environment
    })

    server = await fictionServer.createServer()
    expect(fictionServer.serverUrl.value).toBe(`https://server.test.com`)
  })

  it('handles useLocal scenario', async () => {
    const port = randomBetween(9000, 9999)
    const fictionServer = new FictionServer({
      fictionEnv: testUtils.fictionEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
    })

    server = await fictionServer.createServer({ useLocal: true })
    expect(fictionServer.useLocal.value).toBe(true)
    expect(fictionServer.serverUrl.value).toBe(`http://localhost:${port}`)
  })

  it('useLocal forces other plugins to right place', async () => {
    const port = randomBetween(9000, 9999)
    const fictionServer = new FictionServer({
      fictionEnv: testUtils.fictionEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true), // Simulating live environment
    })

    const fictionUser = new FictionUser({
      fictionEnv: testUtils.fictionEnv,
      fictionDb: testUtils.fictionDb,
      fictionEmail: testUtils.fictionEmail,
      fictionServer,
      tokenSecret: 'test',
    })

    server = await fictionServer.createServer()

    fictionServer.close()

    server = await fictionServer.createServer({ useLocal: true })

    expect(fictionUser.requests.ManageUser.getBaseUrl()).toBe(`http://localhost:${port}`)
    expect(fictionUser.requests.ManageUser.requestUrl).toBe(`http://localhost:${port}/api/user/ManageUser`)
  })

  /**
   * localUrl should get the localhost url with port in server/node
   * when in browser, in dev it should get browser url with port
   * in live mode, it should get the browser url without port
   */
  it('handles localUrl', async () => {
    window.location.href = `${window.location.href}test`
    const port = randomBetween(9000, 9999)
    const fictionEnv = testUtils.fictionEnv
    const fictionServer = new FictionServer({
      fictionEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true),
    })

    expect(fictionServer.localUrl.value).toBe(`http://localhost:${port}`)

    expect(fictionServer.serverUrl.value).toBe(`https://server.test.com`)

    fictionServer.useLocal.value = true

    expect(fictionServer.serverUrl.value).toBe(`http://localhost:${port}`)
  })

  it('handles removes port in live mode in the browser', () => {
    const fictionEnv = testUtils.fictionEnv
    fictionEnv.isNode = false
    const port = randomBetween(9000, 9999)
    window.location.href = 'https://www.apple.com'
    const fictionServer2 = new FictionServer({
      fictionEnv,
      serverName: 'testServer2',
      port,
      liveUrl: `https://server2.test.com`,
      isLive: vue.ref(true),
    })

    fictionServer2.useLocal.value = true
    expect(fictionServer2.localUrl.value).toBe(`https://www.apple.com`)
    expect(fictionServer2.serverUrl.value).toBe(`https://www.apple.com`)

    fictionServer2.isLive.value = false
    expect(fictionServer2.localUrl.value).toBe(`https://www.apple.com:${port}`)
    expect(fictionServer2.serverUrl.value).toBe(`https://www.apple.com:${port}`)
  })
})
