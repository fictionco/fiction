/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, it, describe, beforeAll, afterAll } from "vitest"
import { waitFor, createClientToken } from "@factor/api"
import {
  createSocketServer,
  ClientSocket,
  SocketServerComponents,
} from "../socket"
import { EndpointMeta } from "../endpoint"
type EventMap = { test: string }

let s: SocketServerComponents<EventMap> | undefined = undefined
const port = "1221"
const host = `ws://localhost:${port}`
const events: [keyof EventMap, EventMap[keyof EventMap], EndpointMeta][] = []

describe("sockets", () => {
  beforeAll(async () => {
    s = await createSocketServer<EventMap>({
      name: "testServer",
      port,
    })
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

      events.push(["test", message, meta])
    })
  })

  it("creates a client server", async () => {
    const token = createClientToken({
      email: "hello@world.com",
      userId: "hello",
    })
    const clientSocket = new ClientSocket<EventMap>({
      host,
      token,
    })

    await clientSocket.sendMessage("test", "hello")

    await waitFor(100)

    expect(events).toMatchInlineSnapshot(`
      [
        [
          "test",
          "hello",
          {
            "bearer": {
              "email": "hello@world.com",
              "iat": 888,
              "role": "",
              "userId": "hello",
            },
          },
        ],
      ]
    `)

    expect(events.find((_) => _[1] == "hello")).toBeTruthy()
  })

  it("handles bearer on request", async () => {
    expect(events.find((_) => _[2].bearer)).toBeTruthy()
    expect(events.find((_) => _[2].bearer?.userId)).toBeTruthy()
  })
})
