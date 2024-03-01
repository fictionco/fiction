/**
 * @vitest-environment happy-dom
 */
import type http from 'node:http'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { axios, randomBetween, vue } from '@factor/api/utils'
import type { EndpointResponse } from '@factor/api/types'
import { FactorUser } from '@factor/api/plugin-user'
import { FactorServer } from '..'

let testUtils: TestUtils
let server: http.Server | undefined
describe('server test', () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
  })

  afterEach(() => {
    server?.close()
  })
  it('starts endpoint server', async () => {
    const port = randomBetween(9000, 9999)
    const factorServer = new FactorServer({
      factorEnv: testUtils.factorEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
    })

    server = await factorServer.createServer()

    expect(factorServer.port.value).toBe(port)

    expect(factorServer.serverUrl.value).toBe(`http://localhost:${port}`)

    let response: axios.AxiosResponse<EndpointResponse> | undefined
    try {
      response = await axios.default.get<EndpointResponse>(
        `http://localhost:${factorServer.port.value}/health`,
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
      ]
    `)
  })

  it('switches to live URL correctly', async () => {
    const port = randomBetween(9000, 9999)
    const factorServer = new FactorServer({
      factorEnv: testUtils.factorEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true), // Simulating live environment
    })

    server = await factorServer.createServer()
    expect(factorServer.serverUrl.value).toBe(`https://server.test.com`)
  })

  it('handles useLocal scenario', async () => {
    const port = randomBetween(9000, 9999)
    const factorServer = new FactorServer({
      factorEnv: testUtils.factorEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
    })

    server = await factorServer.createServer({ useLocal: true })
    expect(factorServer.useLocal.value).toBe(true)
    expect(factorServer.serverUrl.value).toBe(`http://localhost:${port}`)
  })

  it('useLocal forces other plugins to right place', async () => {
    const port = randomBetween(9000, 9999)
    const factorServer = new FactorServer({
      factorEnv: testUtils.factorEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true), // Simulating live environment
    })

    const factorUser = new FactorUser({
      factorEnv: testUtils.factorEnv,
      factorDb: testUtils.factorDb,
      factorEmail: testUtils.factorEmail,
      factorServer,
      tokenSecret: 'test',
    })

    server = await factorServer.createServer()

    factorServer.close()

    server = await factorServer.createServer({ useLocal: true })

    expect(factorUser.requests.Login.getBaseUrl()).toBe(`http://localhost:${port}`)
    expect(factorUser.requests.Login.requestUrl).toBe(`http://localhost:${port}/api/user/Login`)
  })

  it('handles localUrl', async () => {
    window.location.href = `${window.location.href}test`
    const port = randomBetween(9000, 9999)
    const factorServer = new FactorServer({
      factorEnv: testUtils.factorEnv,
      serverName: 'testServer',
      port,
      liveUrl: `https://server.test.com`,
      isLive: vue.ref(true),
    })

    expect(factorServer.localUrl.value).toBe(`http://localhost:${port}`)

    expect(factorServer.serverUrl.value).toBe(`https://server.test.com`)

    factorServer.useLocal.value = true

    expect(factorServer.serverUrl.value).toBe(`http://localhost:${port}`)
  })
})
