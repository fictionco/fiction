import { clientToken, emitEvent, isNode, logger, userInitialized, waitFor } from '@factor/api'
import type { SocketMessage } from '@kaption/suite-dashboards/types'
import { engineHost } from '@kaption/engine/endpointMapne/endpointMap'

/**
 * Make stateful so we don't initialize multiple times
 */
let __socket: WebSocket | undefined
let __socketPromise: Promise<WebSocket | undefined> | undefined

export function socketHost(): string {
  return engineHost('ws')
}
/**
 * Gets the socket URL we are using based on settings
 */
export async function socketUrl(): Promise<URL | undefined> {
  await userInitialized()

  const token = clientToken({ action: 'get' }) ?? ''

  if (!token)
    return

  const url = new URL(socketHost())
  url.search = new URLSearchParams({ token }).toString()

  return url
}

function notOpen(ws?: WebSocket): boolean {
  return !ws || ws.readyState === ws.OPEN
}

function resetSocket(): void {
  __socket = undefined
  __socketPromise = undefined
}
/**
 * Initialize the socket and return a promise to resolved socket
 */
export async function initializeSocket(): Promise<WebSocket | undefined> {
  if (isNode)
    return

  const url = await socketUrl()

  if (!url)
    return

  return new Promise<WebSocket | undefined>((resolve, reject) => {
    const sock = new WebSocket(url.toString())

    sock.addEventListener('open', () => {
      logger.log({
        level: 'info',
        context: 'engineSocket',
        description: `connected at ${socketHost()}`,
      })
      sock.addEventListener('message', (event: MessageEvent<string>) => {
        const [name, data] = JSON.parse(event.data) as SocketMessage

        logger.log({
          level: 'info',
          context: 'engineSocket',
          description: `message received: ${name}`,
          data,
        })

        emitEvent(name, data)
      })

      resolve(sock)
    })

    sock.addEventListener('error', (event) => {
      resetSocket()
      const error = event as ErrorEvent
      logger.log({
        level: 'error',
        context: 'engineSocket',
        description: `host (${socketHost()}) is DOWN`,
        data: { error },
      })
      reject()
    })

    sock.addEventListener('close', (event) => {
      resetSocket()
      logger.log({
        level: 'error',
        context: 'engineSocket',
        description: 'connection closed',
        data: { event },
      })
      reject()
    })
  })
}

let __waiting = false
async function retrySocketInSeconds(seconds: number, reason: 'closed' | 'not found'): Promise<WebSocket | undefined> {
  if (__waiting)
    return

  logger.log({
    level: 'info',
    context: 'engineSocket',
    description: `(${reason}) retrying in ${seconds}s`,
  })
  __waiting = true
  await waitFor(seconds * 1000)
  resetSocket()
  __waiting = false

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const socket = await getSocket()

  return socket
}
/**
 * Initialize socket or get already initialized socket
 */
export async function getSocket(): Promise<WebSocket | undefined> {
  if (isNode)
    return

  try {
    if (!__socketPromise) {
      logger.log({
        level: 'info',
        context: 'engineSocket',
        description: 'attempt connection',
      })
      __socketPromise = initializeSocket()
    }

    __socket = await __socketPromise
  }
  catch {
    return await retrySocketInSeconds(5, 'not found')
  }

  if (!notOpen(__socket))
    return await retrySocketInSeconds(2, 'closed')

  return __socket
}

/**
 * Send messages in a standard tuple format
 */
export async function sendSocketMessage(message: SocketMessage): Promise<void> {
  logger.log({
    level: 'info',
    context: 'engineSocket',
    description: 'send message',
    data: { message },
  })
  try {
    const socket = await getSocket()

    if (!socket) {
      logger.log({
        level: 'error',
        context: 'engineSocket',
        description: 'not available',
        data: { apiEnv: process.env.FACTOR_API_ENV, socket },
      })
      return
    }

    socket.send(JSON.stringify(message))
  }
  catch (error: unknown) {
    const e = error as Error | undefined
    logger.log({
      level: 'error',
      context: 'engineSocket',
      description: `message error`,
      data: { error: e },
    })
  }
}
