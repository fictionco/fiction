import { emitEvent, socketServerUrl } from '@kaption/browser-utils'
import { logger } from '@factor/api/logger'
import { getRawConfig } from '../../../@core/client-tag/.ref/config'
import { sendDebug } from '../../../@core/client-tag/.ref/beacon'

/**
 * Make stateful so we don't initialize multiple times
 */
let __socket: WebSocket | undefined
let __socketInitialized: Promise<WebSocket>
let __pingTimeout: NodeJS.Timeout

/**
 * Gets the socket URL we are using based on settings
 */
export async function socketUrl(): Promise<URL> {
  const c = await getRawConfig()

  const socketUrl = socketServerUrl()

  if (!socketUrl)
    throw new Error('socket connection URL is misconfigured')
  if (!c)
    throw new Error('socket config is missing')

  const url = new URL(socketUrl)
  url.search = new URLSearchParams({ c }).toString()

  return url
}
/**
 * Initialize the socket and return a promise to resolved socket
 */
export async function initializeSocket(): Promise<WebSocket> {
  __socketInitialized = new Promise(async (resolve) => {
    const url = await socketUrl()

    const sock = new WebSocket(url.toString())

    sock.addEventListener('open', () => {
      logger.log({ level: 'info', description: 'socket:open' })
      sock.addEventListener('message', (event: MessageEvent<string>) => {
        const [name, data] = JSON.parse(event.data) as [string, unknown[]]

        logger.log({
          level: 'info',
          description: `message received: ${name}`,
          data,
        })
        emitEvent(name, data)
      })

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // heartbeat()

      resolve(sock)
    })

    sock.addEventListener('error', (event) => {
      logger.log({ level: 'error', description: 'socket', data: event })
    })

    sock.addEventListener('close', () => {
      logger.log({ level: 'error', description: 'socket:close' })
      if (__pingTimeout)
        clearTimeout(__pingTimeout)
    })
  })
  return await __socketInitialized
}

function isOpen(ws: WebSocket): boolean {
  return ws.readyState === ws.OPEN
}

/**
 * Initialize socket or get already initialized socket
 */
export async function getSocket(): Promise<WebSocket | undefined> {
  __socket = await __socketInitialized

  if (!isOpen(__socket))
    __socket = await initializeSocket()

  return __socket
}

/**
 * Send messages in a standard tuple format
 */
export async function sendMessage(event: 'ping' | 'track', payload?: unknown): Promise<void> {
  try {
    const sock = await getSocket()

    if (!sock)
      throw new Error('no socket')

    const message = JSON.stringify([event, payload])

    logger.log({ level: 'info', description: event, data: payload })

    sock.send(message)
  }
  catch (error: unknown) {
    const e = error as Error
    sendDebug(e.message)
    logger.log({ level: 'error', description: e.message, data: error })
  }
}
/**
 * Is the socket ready to transmit
 */
export function socketIsReady(): boolean {
  getSocket().catch(error =>
    logger.log({ level: 'error', description: 'get socket', data: error }),
  )
  return !!(__socket && __socket.readyState === 1)
}
