import { clientToken, dLog, emitEvent, userInitialized } from '@factor/api'

/**
 * Make stateful so we don't initialize multiple times
 */
let __socket: WebSocket | undefined
let __socketInitialized: Promise<WebSocket> | undefined
let __pingTimeout: NodeJS.Timeout

/**
 * Gets the socket URL we are using based on settings
 */
export function socketUrl(token: string): URL {
  const socketUrl
    = process.env.FACTOR_API_ENV === 'server'
      ? 'wss://api.kaption.net'
      : `ws://localhost:3300`

  if (!socketUrl)
    throw new Error('socket connection URL is misconfigured')

  const url = new URL(socketUrl)
  url.search = new URLSearchParams({ token }).toString()

  return url
}
/**
 * Initialize the socket and return a promise to resolved socket
 */
export async function initializeSocket(): Promise<WebSocket | undefined> {
  if (typeof window === 'undefined')
    return

  const token = clientToken({ action: 'get' }) ?? ''
  const url = socketUrl(token)

  if (!token)
    return

  __socketInitialized = new Promise(async (resolve) => {
    await userInitialized()

    const sock = new WebSocket(url.toString())

    sock.addEventListener('open', () => {
      dLog('info', 'socket:open')
      sock.addEventListener('message', (event: MessageEvent) => {
        const [name, data] = JSON.parse(event.data)

        dLog('event', `message received: ${name}`, data)
        emitEvent(name, data)
      })

      resolve(sock)
    })

    sock.addEventListener('error', (event) => {
      const error = event as ErrorEvent
      dLog('error', 'socket', error)
    })

    sock.addEventListener('close', (event) => {
      __socketInitialized = undefined
      dLog('error', 'socket:close', event)
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
  if (typeof window === 'undefined')
    return

  if ((!__socket || !isOpen(__socket)) && !__socketInitialized) {
    dLog('info', 'request new socket')
    __socket = await initializeSocket()
  }
  else {
    __socket = await __socketInitialized
  }

  return __socket
}

/**
 * Send messages in a standard tuple format
 */
export async function sendMessage<T = unknown>(event: 'ping' | 'query' | 'request', payload?: T): Promise<void> {
  dLog('info', 'send message')
  try {
    const sock = await getSocket()
    if (!sock)
      throw new Error(`no socket. API: ${process.env.FACTOR_API_ENV}`)

    const message = JSON.stringify([event, payload])

    dLog('send', event, payload)

    sock.send(message)
  }
  catch (error: any) {
    // sendDebug(error.message)
    dLog('error', error.message, error)
  }
}
/**
 * Is the socket ready to transmit
 */
export function socketIsReady(): boolean {
  getSocket()
  return !!(__socket && __socket.readyState === 1)
}
