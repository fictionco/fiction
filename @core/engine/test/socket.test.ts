/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, it, describe, beforeAll, afterAll } from "vitest"
import { waitFor, createClientToken } from "@factor/api"
import * as ws from "ws"
import {
  createSocketServer,
  ClientSocket,
  SocketServerComponents,
} from "../socket"
import { EndpointMeta } from "../endpoint"
type EventMap = { test: string; res: string }

let s: SocketServerComponents<EventMap> | undefined = undefined
const port = "1221"
const host = `ws://localhost:${port}`
type EventMeta = EndpointMeta & {
  connection: ws.WebSocket
  respond: (config: { event: string; payload: any }) => {}
}
const serverEvents: [keyof EventMap, EventMap[keyof EventMap], EventMeta][] = []
const clientEvents: [keyof EventMap, EventMap[keyof EventMap]][] = []
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

      serverEvents.push(["test", message, meta as EventMeta])
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

    clientSocket?.on("res", (data) => {
      clientEvents.push(["res", data])
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
          "hello",
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

    expect(serverEvents.find((_) => _[1] == "hello")).toBeTruthy()
  })

  it("handles bearer on request", async () => {
    expect(serverEvents.find((_) => _[2].bearer)).toBeTruthy()
    expect(serverEvents.find((_) => _[2].bearer?.userId)).toBeTruthy()
  })

  it("sends a message back to client", async () => {
    expect(clientEvents).toMatchInlineSnapshot("[]")

    const testEvent = serverEvents.find((_) => _[1] == "hello")

    testEvent?.[2].respond({ event: "res", payload: "world" })

    await waitFor(100)

    expect(clientEvents.find((_) => _[1] == "world")).toBeTruthy()

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "res",
          "world",
        ],
      ]
    `)
  })
})
