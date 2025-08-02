/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import type {
  SocketMeta,
} from '../socket'
import { afterAll, describe, expect, it } from 'vitest'
import { WebSocket as NodeWebSocket } from 'ws'
import { snap } from '../../test-utils'
import { createTestUtils } from '../../test-utils/init'
import { createUserToken } from '../jwt'
import {
  ClientSocket,
  createSocketServer,
} from '../socket'
import { waitFor } from '../utils'

// Polyfill WebSocket in Node.js environment
const isNode = typeof process === 'object'
  && typeof process.versions === 'object'
  && typeof process.versions.node !== 'undefined'

if (isNode)
  globalThis.WebSocket = NodeWebSocket as unknown as typeof WebSocket

type EventMap = {
  test: { req: 'ping', res: 'pong' }
}

const port = 1221
const host = `ws://localhost:${port}`

const serverEvents: [
  keyof EventMap,
  EventMap[keyof EventMap]['req'],
  SocketMeta<EventMap, 'test'>,
][] = []
const clientEvents: [keyof EventMap, EventMap[keyof EventMap]['res']][] = []

describe('sockets', async () => {
  const testUtils = await createTestUtils({})
  const s = await createSocketServer<EventMap>({
    serverName: 'testSocketServer',
    port,
    fictionUser: testUtils.fictionUser,
    fictionEnv: testUtils.fictionEnv,
  })
  afterAll(async () => {
    s?.endpointServer.server?.close()
    await testUtils.close()
  })

  it('creates a socket server', async () => {
    const nodeSocketServer = s?.socketServer

    expect(nodeSocketServer?.wss).toBeDefined()

    nodeSocketServer?.on('test', (message, meta) => {
      if (meta.bearer)
        meta.bearer = { ...meta.bearer, iat: 888 }

      serverEvents.push(['test', message, meta])
    })
  })

  it('creates a client server', async () => {
    const fictionUser = testUtils?.fictionUser

    if (!fictionUser)
      throw new Error('no fictionUser')

    const token = createUserToken({
      user: {
        email: 'hello@world.com',
        userId: 'hello',
      },
      tokenSecret: fictionUser.settings.tokenSecret,
    })
    const clientSocket = new ClientSocket<EventMap>({
      host,
      token,
      fictionUser,
    })

    await clientSocket.sendMessage('test', 'ping')

    clientSocket?.on('test', (data) => {
      clientEvents.push(['test', data])
    })

    await waitFor(100)

    const r = serverEvents.map((e) => {
      // @ts-expect-error remove connection, although it says it needs be optional
      delete e[2].connection
      return e
    })

    expect(snap(r, { maskedKeys: ['bearerToken', 'pingAliveTime', 'respond'] })).toMatchInlineSnapshot(`
      [
        [
          "test",
          "ping",
          {
            "bearer": {
              "email": "[email:TRUTHY]",
              "exp": "1754753651",
              "iat": "888",
              "systemRole": "",
              "userId": "[id:TRUTHY]",
              "verifyEmail": "[email:TRUTHY]",
            },
            "bearerToken": "**MASKED**",
            "channels": [
              "hello",
            ],
            "clientId": "[id:TRUTHY]",
            "connectionId": "[id:TRUTHY]",
            "pingAlive": "true",
            "pingAliveTime": "**MASKED**",
            "respond": "**MASKED**",
          },
        ],
      ]
    `)

    expect(serverEvents.find(_ => _[1] === 'ping')).toBeTruthy()
  }, { timeout: 10000 })

  it('handles bearer on request', async () => {
    expect(serverEvents.find(_ => _[2].bearer)).toBeTruthy()
    expect(serverEvents.find(_ => _[2].bearer?.userId)).toBeTruthy()
  })

  it('sends a message back to client', async () => {
    expect(clientEvents).toMatchInlineSnapshot('[]')

    const testEvent = serverEvents.find(_ => _[1] === 'ping')

    testEvent?.[2].respond('pong')

    await waitFor(100)

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "test",
          "pong",
        ],
      ]
    `)

    expect(clientEvents.find(_ => _[1] === 'pong')).toBeTruthy()

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "test",
          "pong",
        ],
      ]
    `)
  })
})
