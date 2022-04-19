/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, it, describe, beforeAll, afterAll } from "vitest"
import { waitFor, createClientToken } from "../.."

import {
  createSocketServer,
  ClientSocket,
  SocketServerComponents,
  SocketMeta,
} from "../socket"

import { createTestUtils, TestUtils } from "../../test-utils"
type EventMap = {
  test: { req: "ping"; res: "pong" }
}

let s: SocketServerComponents<EventMap> | undefined = undefined
const port = "1221"
const host = `ws://localhost:${port}`

const serverEvents: [
  keyof EventMap,
  EventMap[keyof EventMap]["req"],
  SocketMeta<EventMap, "test">,
][] = []
const clientEvents: [keyof EventMap, EventMap[keyof EventMap]["res"]][] = []

let testUtils: TestUtils | undefined = undefined
describe("sockets", () => {
  beforeAll(async () => {
    s = await createSocketServer<EventMap>({
      name: "testServer",
      port,
    })
    testUtils = await createTestUtils()
  })
  afterAll(async () => {
    s?.endpointServer.server?.close()
  })

  it("creates a socket server", async () => {
    const nodeSocketServer = s?.socketServer

    expect(nodeSocketServer?.wss).toBeDefined()

    nodeSocketServer?.on("test", (message, meta) => {
      if (meta.bearer) {
        meta.bearer = { ...meta.bearer, iat: 888 }
      }

      serverEvents.push(["test", message, meta])
    })
  })

  it("creates a client server", async () => {
    const factorUser = testUtils?.factorUser

    if (!factorUser) throw new Error("no factorUser")

    const token = createClientToken({
      email: "hello@world.com",
      userId: "hello",
    })
    const clientSocket = new ClientSocket<EventMap>({
      host,
      token,
      factorUser,
    })

    await clientSocket.sendMessage("test", "ping")

    clientSocket?.on("test", (data) => {
      clientEvents.push(["test", data])
    })

    await waitFor(100)

    expect(
      serverEvents.map((e) => {
        // @ts-ignore
        delete e[2].connection
        return e
      }),
    ).toMatchInlineSnapshot(`
      [
        [
          "test",
          "ping",
          {
            "bearer": {
              "email": "hello@world.com",
              "iat": 888,
              "role": "",
              "userId": "hello",
            },
            "respond": [Function],
          },
        ],
      ]
    `)

    expect(serverEvents.find((_) => _[1] == "ping")).toBeTruthy()
  })

  it("handles bearer on request", async () => {
    expect(serverEvents.find((_) => _[2].bearer)).toBeTruthy()
    expect(serverEvents.find((_) => _[2].bearer?.userId)).toBeTruthy()
  })

  it("sends a message back to client", async () => {
    expect(clientEvents).toMatchInlineSnapshot("[]")

    const testEvent = serverEvents.find((_) => _[1] == "ping")

    testEvent?.[2].respond("pong")

    await waitFor(100)

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "test",
          "pong",
        ],
      ]
    `)

    expect(clientEvents.find((_) => _[1] == "pong")).toBeTruthy()

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
