import { EventEmitter } from "events"
import http from "http"
import express from "express"
import * as ws from "ws"
import { log } from "../plugin-log"
import type { FactorUser } from "../plugin-user"
import { _stop } from "./error"
import { emitEvent } from "./event"
import { waitFor } from "./utils"
import { Endpoint, EndpointMeta } from "./endpoint"
import { EndpointServer } from "./endpointServer"

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
  factorUser: FactorUser
}

export declare interface ClientSocket<T extends EventMap> {
  on<U extends keyof T>(
    event: U,
    listener: (message: T[U]["res"]) => void,
  ): this
  on(event: string, listener: () => void): this
}
export declare interface NodeSocketServer<T extends EventMap> {
  on<U extends keyof T>(
    event: U,
    listener: (message: T[U]["req"], meta: SocketMeta<T, U>) => void,
  ): this
  on(event: string, listener: () => void): this
}

export class ClientSocket<T extends EventMap> extends EventEmitter {
  host: string
  socket?: WebSocket | undefined
  socketPromise?: Promise<WebSocket | undefined> | undefined
  waiting = false
  context = "clientSocket"
  token?: string
  factorUser: FactorUser
  log = log.contextLogger(this.constructor.name)
  constructor(options: ClientSocketOptions) {
    super()
    this.host = options.host
    this.token = options.token
    this.factorUser = options.factorUser
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token

    await this.factorUser.userInitialized()

    return this.factorUser.clientToken({ action: "get" }) ?? ""
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

  /**
   * Don't call from external, use getSocket instead
   */
  private async initialize(): Promise<WebSocket | undefined> {
    const url = await this.socketUrl()

    if (!url) {
      log.error(this.context, "url unavailable", {
        data: { url, host: this.host },
      })
      return
    }

    return new Promise<WebSocket | undefined>((resolve, reject) => {
      this.log.info(`connecting at ${this.host}`)

      const sock = new WebSocket(url.toString())

      sock.addEventListener("open", () => {
        this.log.info(`connected at ${this.host}`)

        sock.addEventListener("message", (event: MessageEvent<string>) => {
          const [name, data] = JSON.parse(event.data) as SocketMessage<
            T,
            keyof T,
            "req"
          >

          this.log.info(`message received: ${String(name)}`, { data })

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
        log.error(this.context, "connection closed", { data: { event } })
        reject()
      })
    })
  }

  private async retrySocketInSeconds(
    seconds: number,
    reason: "closed" | "not found",
  ): Promise<WebSocket | undefined> {
    if (this.waiting) return

    this.log.info(`(${reason}) retrying in ${seconds}s`)
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

    try {
      const socket = await this.getSocket()

      if (!socket) {
        log.error(this.context, "not available", {
          data: { socket },
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
  public wss?: ws.WebSocketServer // type not available in browser/build
  private context = "socketServer"
  factorUser: FactorUser
  log = log.contextLogger(this.constructor.name)
  constructor(settings: { factorUser: FactorUser }) {
    super()
    this.factorUser = settings.factorUser
  }

  async createServer({ app }: { app: express.Express }): Promise<http.Server> {
    this.app = app
    const socketServer = http.createServer(this.app)

    /**
     * This import doesn't exist in browser/build and needs to be ignored by vite to
     * prevent "'WebSocketServer' is not exported by..." error
     */
    const { WebSocketServer } = await import(/* @vite-ignore */ "ws")

    this.wss = new WebSocketServer({
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
          const tokenData = this.factorUser.decodeClientToken(token)
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

    connection.send(JSON.stringify(message))
    return
  }
}

export type SocketServerComponents<T extends EventMap> = {
  socketServer: NodeSocketServer<T>
  endpointServer: EndpointServer
}

export const createSocketServer = async <T extends EventMap>(args: {
  serverName: string
  port: number
  endpoints?: Endpoint[]
  factorUser: FactorUser
}): Promise<SocketServerComponents<T>> => {
  const { port, serverName, endpoints = [], factorUser } = args

  const socketServer = new NodeSocketServer<T>({ factorUser })

  const endpointServer = new EndpointServer({
    serverName,
    port,
    endpoints,
    customServer: (app) => socketServer.createServer({ app }),
    factorUser,
  })

  await endpointServer.runServer()

  return { socketServer, endpointServer }
}
