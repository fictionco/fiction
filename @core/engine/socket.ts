import { EventEmitter } from "events"
import http from "http"
import { clientToken, emitEvent, log, waitFor, _stop } from "@factor/api"

import express from "express"

import * as ws from "ws"
import { decodeClientToken, TokenFields } from "@factor/api/jwt"
import { userInitialized } from "./userInit"
import { Endpoint, EndpointMeta } from "./endpoint"
import { EndpointServer } from "./endpointServer"

/**
 *   ping: {}
  welcome: { res: TokenFields }
 */
export type EventMap = {
  [key: string]: { req?: unknown; res?: unknown }
}

export type SocketMessage<
  U extends EventMap,
  V extends keyof U,
  W extends "req" | "res",
> = [V, U[V][W]]

export type SocketMeta<T extends EventMap, U extends keyof T> = EndpointMeta & {
  connection: ws.WebSocket
  respond: ResponseFunction<T, U>
}
export type ResponseFunction<T extends EventMap, U extends keyof T> = (
  response: T[U]["res"],
) => void

type ClientSocketOptions = {
  host: string
  token?: string
}

export declare interface ClientSocket<T extends EventMap> {
  on<U extends keyof T>(
    event: U,
    listener: (message: T[U]["res"]) => void,
  ): this
  on(event: string, listener: () => {}): this
}
export declare interface NodeSocketServer<T extends EventMap> {
  on<U extends keyof T>(
    event: U,
    listener: (message: T[U]["req"], meta: SocketMeta<T, U>) => void,
  ): this
  on(event: string, listener: () => {}): this
}

export class ClientSocket<T extends EventMap> extends EventEmitter {
  host: string
  socket?: WebSocket | undefined
  socketPromise?: Promise<WebSocket | undefined> | undefined
  waiting = false
  context = "clientSocket"
  token?: string
  constructor(options: ClientSocketOptions) {
    super()
    this.host = options.host
    this.token = options.token
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token

    await userInitialized()

    return clientToken({ action: "get" }) ?? ""
  }

  private async socketUrl(): Promise<URL | undefined> {
    const url = new URL(this.host)
    const token = await this.getToken()
    url.search = new URLSearchParams({ token }).toString()

    return url
  }

  private notOpen(ws?: WebSocket): boolean {
    return !ws || ws.readyState === ws.OPEN
  }

  private resetSocket(): void {
    this.socket = undefined
    this.socketPromise = undefined
  }

  private async initialize(): Promise<WebSocket | undefined> {
    const url = await this.socketUrl()

    if (!url) {
      log.error(this.context, "url unavailable", {
        data: { url, host: this.host },
      })
      return
    }

    return new Promise<WebSocket | undefined>((resolve, reject) => {
      log.info(this.context, `connecting at ${this.host}`)

      const sock = new WebSocket(url.toString())

      sock.addEventListener("open", () => {
        log.info(this.context, `connected at ${this.host}`)

        sock.addEventListener("message", (event: MessageEvent<string>) => {
          const [name, data] = JSON.parse(event.data) as SocketMessage<
            T,
            keyof T,
            "req"
          >

          log.info(this.context, `message received: ${name}`, { data })

          emitEvent(name as string, data)

          this.emit(name as string, data)
        })

        resolve(sock)
      })

      sock.addEventListener("error", (event) => {
        this.resetSocket()
        const error = event as ErrorEvent
        log.error(this.context, `host (${this.host}) is DOWN`, { error })
        reject()
      })

      sock.addEventListener("close", (event) => {
        this.resetSocket()
        log.error(this.context, "connection closed", {
          data: { event },
        })
        reject()
      })
    })
  }

  private async retrySocketInSeconds(
    seconds: number,
    reason: "closed" | "not found",
  ): Promise<WebSocket | undefined> {
    if (this.waiting) return

    log.info(this.context, `(${reason}) retrying in ${seconds}s`)
    this.waiting = true
    await waitFor(seconds * 1000)
    this.resetSocket()
    this.waiting = false

    const socket = await this.getSocket()

    return socket
  }

  public async getSocket(): Promise<WebSocket | undefined> {
    if (typeof WebSocket === "undefined") {
      log.error(this.context, "client socket missing (node)")
      return
    }

    try {
      if (!this.socketPromise) {
        log.info(this.context, "attempt connection")
        this.socketPromise = this.initialize()
      }

      this.socket = await this.socketPromise
    } catch {
      return await this.retrySocketInSeconds(5, "not found")
    }

    if (!this.notOpen(this.socket)) {
      return await this.retrySocketInSeconds(2, "closed")
    }

    return this.socket
  }

  public async sendMessage<U extends keyof T>(
    type: U,
    payload: T[U]["req"],
  ): Promise<void> {
    const message: SocketMessage<T, U, "req"> = [type, payload]
    log.info(this.context, "sending message", { data: { message } })
    try {
      const socket = await this.getSocket()

      if (!socket) {
        log.error(this.context, "not available", {
          data: { apiEnv: process.env.FACTOR_API_ENV, socket },
        })
        return
      }

      socket.send(JSON.stringify(message))
    } catch (error: unknown) {
      log.error(this.context, `message error`, { error })
    }
  }
}

export class NodeSocketServer<T extends EventMap> extends EventEmitter {
  public app?: express.Express
  public server?: http.Server
  public wss?: ws.WebSocketServer
  private context = "socketServer"

  public createServer({ app }: { app: express.Express }): http.Server {
    this.app = app
    const socketServer = http.createServer(this.app)

    this.wss = new ws.WebSocketServer({
      noServer: true,
      maxPayload: 10_000_000,
    })

    // https://github.com/websockets/ws/issues/377#issuecomment-462152231
    socketServer.on("upgrade", async (request, socket, head) => {
      try {
        const { url: socketPathname = "/" } = request
        const search = socketPathname.split("?").pop() ?? ""
        const urlParams = new URLSearchParams(search)

        const token = urlParams.get("token")

        request.bearer = undefined
        request.bearerToken = undefined

        if (token) {
          const tokenData = decodeClientToken(token)
          request.bearer = tokenData
          request.bearerToken = token
        }
      } catch (error: unknown) {
        log.error(this.context, `token error`, { error })
        socket.destroy()
        return
      }

      this.wss?.handleUpgrade(request, socket, head, (ws) => {
        this.wss?.emit("connection", ws, request)
      })
    })

    this.wss.on("connection", (connection, request) => {
      connection.send(JSON.stringify(["welcome", request.bearer]))

      log.debug(this.context, `connection total: ${this.wss?.clients.size}`)

      connection.on("message", async (message: string) => {
        let parsed: unknown
        try {
          parsed = JSON.parse(message)
        } catch {
          log.error(this.context, "error parsing socket message", {
            data: { message },
          })
          return
        }

        if (!Array.isArray(parsed)) {
          log.error(this.context, "invalid socket message format", {
            data: { parsed },
          })
          return
        }

        const [event, payload] = parsed as SocketMessage<T, keyof T, "req">

        if (event === "ping") connection.pong(message)

        this.emit(event as string, payload, {
          connection,
          bearer: request.bearer,
          respond: <V extends keyof T>(payload: T[V]["res"]): void => {
            return this.send({ event, payload, connection })
          },
        })
      })

      this.wss?.on("error", (error) => {
        log.error(this.context, "ws message error", { error })
      })
    })

    this.wss.on("error", (error: Error) => {
      log.error(this.context, "ws connection error", { error })
    })
    return socketServer
  }

  public send<V extends keyof T>(config: {
    event: V
    payload: T[V]["res"]
    connection: ws.WebSocket
  }): void {
    const { event, payload, connection } = config
    const message: SocketMessage<T, keyof T, "res"> = [event, payload]
    log.info(this.context, "sending message", { data: { message } })
    connection.send(JSON.stringify(message))
    return
  }
}

export type SocketServerComponents<T extends EventMap> = {
  socketServer: NodeSocketServer<T>
  endpointServer: EndpointServer
}

export const createSocketServer = async <T extends EventMap>(args: {
  name: string
  port: string
  endpoints?: Endpoint[]
}): Promise<SocketServerComponents<T>> => {
  const { port, name, endpoints = [] } = args

  const socketServer = new NodeSocketServer<T>()

  const endpointServer = new EndpointServer({
    name,
    port,
    endpoints,
    customServer: (app) => socketServer.createServer({ app }),
  })

  await endpointServer.runServer()

  return { socketServer, endpointServer }
}
