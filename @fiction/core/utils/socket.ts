import type express from 'express'

import type * as ws from 'ws'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { FictionUser, User } from '../plugin-user/index.js'
import type { Endpoint, EndpointMeta } from './endpoint.js'
// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events'
import http from 'node:http'
import { log } from '../plugin-log/index.js'
import { EndpointServer } from './endpointServer.js'
import { emitEvent } from './event.js'
import { objectId, shortId } from './id.js'
import { decodeUserToken, manageClientUserToken } from './jwt.js'
import { dayjs } from './libraries.js'
import { fastHash, waitFor } from './utils.js'

export interface EventMap {
  [key: string]: { req?: unknown, res?: unknown }
}

export type SocketMessage<
  U extends EventMap,
  V extends keyof U,
  W extends 'req' | 'res',
> = [V, U[V][W], { channels?: string[], sentFrom?: string, timestamp?: number }]

export interface ConnectionMeta {
  channels: string[]
  clientId: string
  connectionId: string
  connection: ws.WebSocket
  bearer?: User
  bearerToken?: string
  pingAlive?: boolean
  pingAliveTime: number
  [key: string]: unknown
}

export type SocketMeta<T extends EventMap, U extends keyof T> = EndpointMeta & {
  connection: ws.WebSocket
  respond: ResponseFunction<T, U>
}
export type ResponseFunction<T extends EventMap, U extends keyof T> = (
  response: T[U]['res'],
) => void

interface ClientSocketOptions {
  host: string
  token?: string
  channels?: string[]
  fictionUser?: FictionUser
  search?: Record<string, string>
  context?: string
}

export class ClientSocket<T extends EventMap> extends EventEmitter {
  host: string
  wsHost = () => {
    const url = new URL(this.host)
    url.protocol = url.protocol.replace('http', 'ws')
    return url.toString()
  }

  socket?: WebSocket | undefined
  socketPromise?: Promise<WebSocket | undefined> | undefined
  waiting = false
  context: string
  token?: string
  fictionUser?: FictionUser
  log = log.contextLogger(this.constructor.name)
  search?: Record<string, string | string[]>
  channels?: string[]
  socketUserId?: string | undefined
  constructor(options: ClientSocketOptions) {
    super()
    this.host = options.host
    this.token = options.token
    this.fictionUser = options.fictionUser
    this.search = options.search ?? {}
    this.context = options.context ?? 'clientSocket'
    if (options.channels)
      this.search.channels = options.channels

    this.log.info(`client socket(${this.context}) at: ${this.wsHost()}`)

    this.socketUserId = this.fictionUser?.activeUser.value?.userId
  }

  private async getToken(): Promise<string> {
    if (!this.fictionUser)
      return ''
    if (this.token)
      return this.token

    await this.fictionUser.userInitialized({ caller: 'getToken' })

    return manageClientUserToken({ _action: 'get', key: this.fictionUser.userTokenKey }) ?? ''
  }

  private async socketUrl(): Promise<string | undefined> {
    const url = new URL(this.wsHost())
    const token = await this.getToken()
    const clientId = token ? fastHash(token) : objectId()
    url.search = new URLSearchParams({
      clientId,
      token,
      ...this.search,
    }).toString()
    return url.toString()
  }

  /**
   * Checks if client socket is ready to connect
   * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
   */
  private isClosed(ws?: WebSocket): boolean {
    const result = !ws || ws.readyState !== 1
    return result
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
      const data = { url, host: this.wsHost() }
      log.error(this.context, 'url unavailable', { data })
      return
    }

    return new Promise<WebSocket | undefined>((resolve, reject) => {
      this.log.info(`connecting at ${this.wsHost()}`)

      const sock = new WebSocket(url)

      sock.addEventListener('open', () => {
        this.log.info(`connected at ${this.wsHost()}`)

        let pingTimeout: NodeJS.Timeout

        const heartbeat = (args: { reason: string }) => {
          const { reason } = args ?? {}
          clearTimeout(pingTimeout)
          const lastBeat = Date.now()
          this.log.warn(`heartbeat: ${reason}`)
          pingTimeout = setTimeout(() => {
            this.log.warn(`ping timeout: ${Date.now() - lastBeat}`)
            sock.close()
          }, 30_000 + 5000)
        }

        heartbeat({ reason: 'init' })

        sock.addEventListener('ping', () => {
          heartbeat({ reason: 'ping' })
          sock.send('pong')
        })

        sock.addEventListener('message', (event: MessageEvent<string>) => {
          heartbeat({ reason: 'message' })

          if (event.data === 'ping')
            return sock.send('pong')
          else if (event.data === 'pong')
            return

          const [name, data, meta] = JSON.parse(event.data) as SocketMessage<
            T,
            keyof T,
            'req'
          >

          emitEvent(name as string, data, meta)

          this.emit(name as string, data, meta)
        })

        resolve(sock)
      })

      sock.addEventListener('error', (event) => {
        this.resetSocket()
        const error = event as ErrorEvent
        log.error(this.context, `host (${this.wsHost()}) is DOWN`, {
          error,
        })
        reject(event)
      })

      sock.addEventListener('close', (event) => {
        this.resetSocket()
        log.error(this.context, 'client socket closed', { data: { event } })
        reject(event)
      })
    })
  }

  private async retrySocketInSeconds(
    seconds: number,
    reason: 'closed' | 'not found',
  ): Promise<WebSocket | undefined> {
    if (this.waiting)
      return

    this.log.warn(`socket: (${reason}) retry in ${seconds}s`)
    this.waiting = true
    await waitFor(seconds * 1000)
    this.resetSocket()
    this.waiting = false

    const socket = await this.getSocket()

    return socket
  }

  public async getSocket(): Promise<WebSocket | undefined> {
    this.log.info('getting socket')

    if (typeof WebSocket === 'undefined')
      throw new Error('client WebSocket global missing (node)')

    try {
      if (!this.socketPromise) {
        this.log.info('getting socket')
        this.socketPromise = this.initialize()
      }

      this.socket = await this.socketPromise
    }
    catch {
      return this.retrySocketInSeconds(5, 'not found')
    }

    if (this.isClosed(this.socket))
      return this.retrySocketInSeconds(2, 'closed')

    return this.socket
  }

  public async sendMessage<U extends keyof T>(
    type: U,
    data: T[U]['req'],
  ): Promise<void> {
    const message: SocketMessage<T, U, 'req'> = [type, data, {}]

    try {
      const socket = await this.getSocket()

      if (!socket) {
        const url = await this.socketUrl()
        log.error(this.context, 'socket not available', {
          data: { url, socket },
        })
        return
      }

      socket.send(JSON.stringify(message))
    }
    catch (error: unknown) {
      log.error(this.context, `message error`, { error })
    }
  }
}

type WelcomeObjectCallback = (
  args: {
    bearer?: User
    bearerToken?: string
    [key: string]: unknown
  },
  request: http.IncomingMessage,
) => Promise<Record<string, unknown>>

interface NodeSocketServerSettings {
  fictionUser?: FictionUser
  maxPayload?: number
  welcomeObject?: WelcomeObjectCallback
}

export class NodeSocketServer<T extends EventMap> extends EventEmitter {
  public app?: express.Express
  public server?: http.Server
  public wss?: ws.WebSocketServer // type not available in browser/build
  private context = 'socketServer'
  fictionUser?: FictionUser
  fictionDb?: FictionDb
  log = log.contextLogger(this.constructor.name)
  maxPayload: number
  welcomeObject?: WelcomeObjectCallback
  connections: ConnectionMeta[] = []
  checkConnectionInterval?: NodeJS.Timeout
  constructor(settings: NodeSocketServerSettings) {
    super()
    this.fictionUser = settings.fictionUser
    this.maxPayload = settings.maxPayload || 10_000_000
    this.welcomeObject = settings.welcomeObject

    this.checkConnectionInterval = setInterval(() => {
      this.connections = this.connections.filter((cm) => {
        if (dayjs().unix() - cm.pingAliveTime > 60) {
          this.log.info('terminating connection due to timeout', {
            data: { connectionId: cm.connectionId },
          })
          cm.connection.terminate()
          return false
        }
        else {
          this.log.debug(`pinging:${cm.connectionId}`)
          cm.pingAlive = false
          cm.connection.send('ping')
          cm.connection.ping()
          return true
        }
      })
    }, 30_000)

    this.checkConnectionInterval.unref?.()
  }

  close() {
    clearInterval(this.checkConnectionInterval)
  }

  async sendWelcome(
    connection: ws.WebSocket,
    meta: ConnectionMeta,
    request: http.IncomingMessage,
  ) {
    const { connection: _connection, ...rest } = this.welcomeObject
      ? await this.welcomeObject(meta, request)
      : meta

    const fullWelcome = {
      status: 'success',
      message: 'welcome',
      data: rest,
    }

    connection.send(JSON.stringify(['welcome', fullWelcome]))
  }

  async createServer({ app }: { app: express.Express }): Promise<http.Server> {
    this.app = app
    const socketServer = http.createServer(this.app)

    /**
     * This import doesn't exist in browser/build and needs to be ignored by vite to
     * prevent "'WebSocketServer' is not exported by..." error
     */
    const { WebSocketServer } = await import(/* @vite-ignore */ 'ws')

    this.wss = new WebSocketServer({
      noServer: true,
      maxPayload: this.maxPayload,
    })

    // https://github.com/websockets/ws/issues/377#issuecomment-462152231
    socketServer.on('upgrade', async (request, socket, head) => {
      try {
        const { url: socketPathname = '/' } = request
        const search = socketPathname.split('?').pop() ?? ''
        const urlParams = new URLSearchParams(search)

        const token = urlParams.get('token')
        const clientId = urlParams.get('clientId')

        request.channels = urlParams.get('channels')?.split(',') ?? undefined
        request.bearer = undefined
        request.bearerToken = undefined

        if (token && this.fictionUser) {
          const tokenData = decodeUserToken({ token, tokenSecret: this.fictionUser.settings.tokenSecret })
          request.bearer = tokenData
          request.bearerToken = token
        }

        request.clientId = clientId || objectId({ prefix: 'none' })
      }
      catch (error: unknown) {
        log.error(this.context, `token error`, { error })
        socket.destroy()
        return
      }

      this.wss?.handleUpgrade(request, socket, head, (ws) => {
        this.wss?.emit('connection', ws, request)
      })
    })

    this.wss.on('connection', (connection, request) => {
      const ch = request.channels ?? [request.bearer?.userId]

      const channels = ch.filter(Boolean) as string[]

      if (!channels) {
        this.fictionUser?.log.error('socket connection missing key', {
          data: { request: request.url },
        })
        return
      }
      const clientId = request.clientId || objectId()
      const connectionId = `${clientId}_${shortId({ len: 7 })}`
      const connectionMeta: ConnectionMeta = {
        clientId,
        connectionId,
        connection,
        bearer: request.bearer,
        bearerToken: request.bearerToken,
        channels,
        pingAlive: true,
        // unix dayjs
        pingAliveTime: dayjs().unix(),
      }

      this.log.info(`new connection:${connectionId}`, { data: { ch } })

      this.sendWelcome(connection, connectionMeta, request).catch(console.error)

      this.emit('connect', {}, connectionMeta)

      this.connections = [...this.connections, connectionMeta]

      log.info(this.context, `connection total`, {
        data: {
          clients: this.wss?.clients.size,
          connections: this.connections.length,
          ids: this.connections.map(c => c.connectionId),
        },
      })

      const setAlive = (_msg: string) => {
        const ind = this.connections.findIndex(
          c => c.connectionId === connectionId,
        )
        if (ind >= 0 && this.connections[ind]) {
          this.connections[ind].pingAlive = true
          this.connections[ind].pingAliveTime = dayjs().unix()
        }
        else {
          this.log.error('connection not found', {
            data: { connectionId, connections: this.connections },
          })
        }
      }

      connection.on('pong', () => setAlive(`event:pong:${connectionId}`))

      connection.on('message', async (message: string) => {
        setAlive(`message: ${message.slice(0, 5)}`)

        if (message === 'ping') {
          this.log.info(`ping:pong:${connectionId}`)
          return connection.send('pong')
        }
        else if (message === 'pong') {
          this.log.info(`pong:${connectionId}`)
          return
        }

        let parsed: unknown
        try {
          parsed = JSON.parse(message)
        }
        catch {
          this.log.error('error parsing socket message', {
            data: { message },
          })
          return
        }

        if (!Array.isArray(parsed)) {
          this.log.error('invalid socket message format', {
            data: { parsed },
          })
          return
        }

        const [event, data] = parsed as SocketMessage<T, keyof T, 'req'>

        this.emit(event as string, data, {
          ...connectionMeta,
          respond: <V extends keyof T>(data: T[V]['res']): void => {
            return this.send({ event, data, connection })
          },
        })
      })

      connection.on('close', (code, reason) => {
        this.log.info(`connection closed (${code}: ${reason.toString()})`)
      })

      connection.on('error', (error) => {
        this.log.error(`connection error: ${error.message}`, { error })
      })

      this.wss?.on('error', (error) => {
        this.log.error('ws message error', { error })
      })
    })

    this.wss.on('error', (error: Error) => {
      this.log.error('ws connection error', { error })
    })
    return socketServer
  }

  public send<V extends keyof T>(config: {
    event: V
    data: T[V]['res']
    connection?: ws.WebSocket
    channels?: string[]
    sentFrom?: string
  }): void {
    const { event, data, connection, channels, sentFrom } = config
    this.log.info(`socket send ${event as string}`)
    let connections: ws.WebSocket[] = []
    if (channels) {
      connections = this.connections
        .filter((c) => {
          return c.channels.some(channel => channels.includes(channel))
        })
        .map(c => c.connection)

      this.log.debug(
        `send ${String(event)} to ${connections.length} connections`,
        {
          data: {
            connects: this.connections.map(_ => ({
              channels: _.channels,
              id: _.connectionId,
            })),
            channels,
          },
        },
      )
    }
    else if (connection) {
      connections = [connection]
    }
    else {
      throw new Error('must provide "connection" or "channels"')
    }

    const message: SocketMessage<T, keyof T, 'res'> = [
      event,
      data,
      { channels, sentFrom, timestamp: Date.now() },
    ]

    connections.forEach((c) => {
      c.send(JSON.stringify(message))
    })
  }
}

export interface SocketServerComponents<T extends EventMap> {
  socketServer: NodeSocketServer<T>
  endpointServer: EndpointServer
}

export async function createSocketServer<T extends EventMap>(args: {
  fictionEnv: FictionEnv
  serverName: string
  port: number
  endpoints?: Endpoint[]
  fictionUser?: FictionUser
  welcomeObject?: WelcomeObjectCallback
  maxPayload?: number
  url?: string
}): Promise<SocketServerComponents<T>> {
  const {
    port,
    serverName,
    endpoints = [],
    fictionUser,
    welcomeObject,
    maxPayload,
    url,
    fictionEnv,
  } = args

  const socketServer = new NodeSocketServer<T>({
    fictionUser,
    welcomeObject,
    maxPayload,
  })

  const endpointServer = new EndpointServer({
    fictionEnv,
    serverName,
    port,
    endpoints,
    customServer: async app => socketServer.createServer({ app }),
    fictionUser,
    url,
  })

  await endpointServer.runServer()

  return { socketServer, endpointServer }
}
