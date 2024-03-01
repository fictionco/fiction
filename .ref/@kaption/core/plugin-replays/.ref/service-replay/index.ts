import http from 'node:http'
import ws from 'ws'
import type {
  JSendMessage,
} from '@kaption/service'
import {
  createExpress,
  ensureClientId,
  getIpAddress,
  logServiceStatus,
  parseConnectionParams,
  publishEvent,
  subscribeEvent,
  validateConnectionDomain,
} from '@kaption/service'
import { logger } from '@factor/api'
import type {
  BeaconData,
  ClientConfig,
  ConnectionConfig,
  EndpointResponse,
  SocketMessageDataItem,
} from '@kaption/engine'
import { onConnection } from '@kaption/manager/connection'

import { processMessageData } from './process'

const __connections: Record<string, ws> = {}

export function noop(): void {}

export function heartbeat(): void {}

type StandardMessage = ['ping' | 'track', Record<string, any>]

async function createConnectionConfig(request: http.IncomingMessage, clientConfig: ClientConfig): Promise<ConnectionConfig> {
  const { headers } = request
  const { origin = '', 'user-agent': userAgent = '' } = headers

  const { ip, rawIp } = await getIpAddress(request)

  return { ip, rawIp, userAgent, origin, ...clientConfig }
}
/**
 * Save connection information for a specific socket client
 * This enables two-way communication
 */
async function getConnectionConfig(wsConnection: ws, request: http.IncomingMessage): Promise<ConnectionConfig | undefined> {
  const { url: socketPathname = '/' } = request
  const { ip } = await getIpAddress(request)

  const parsed = parseConnectionParams(socketPathname.split('?').pop() ?? '')

  if (!parsed) {
    logger.log({
      level: 'error',
      context: 'ingest',
      description: `could not get socket config`,
      data: parsed,
    })
    return
  }

  const { clientId, projectId } = parsed

  parsed.clientId = ensureClientId({ ip, clientId, projectId })

  __connections[parsed.clientId] = wsConnection

  const config = await createConnectionConfig(request, parsed)

  return config
}
/**
 * Notify a client connection about an event
 */
function notifyClient(clientId: string, eventName: string, data: any): void {
  if (__connections[clientId]) {
    const ws = __connections[clientId]
    ws.send(JSON.stringify([eventName, data]))
  }
}

export async function setup(): Promise<void> {
  const port = Number.parseInt(process.env.PORT ?? '3100')

  const app = createExpress()

  const server = http.createServer(app)

  const wss = new ws.Server({ server, maxPayload: 21_000_000 })

  wss.on('connection', async (ws, request) => {
    try {
      // parse connection url and save the connection for communications
      const connectionConfig: ConnectionConfig | undefined
        = await getConnectionConfig(ws, request)

      logger.log({
        level: 'debug',
        description: `analytics socket connection: ${wss.clients.size} total`,
        data: connectionConfig,
      })

      if (!connectionConfig) {
        logger.log({
          level: 'error',
          context: 'ingest',
          description: 'connection config error',
        })
        return
      }

      // check domain validation (cache = async)
      const domainValid = await validateConnectionDomain(connectionConfig)

      if (!domainValid)
        return

      await onConnection('socket', connectionConfig)

      publishEvent('newConnection', connectionConfig)

      ws.on('message', (message: string) => {
        if (!connectionConfig) {
          logger.log({
            level: 'error',
            context: 'ingest',
            description: 'no connection config on message',
          })
          return
        }

        let parsed: unknown
        try {
          parsed = JSON.parse(message)
        }
        catch {
          logger.log({
            level: 'error',
            context: 'ingest',
            description: 'error parsing socket message',
            data: {
              message,
            },
          })
          return
        }

        if (!Array.isArray(parsed)) {
          logger.log({
            level: 'error',
            context: 'ingest',
            description: 'invalid socket message format',
            data: {
              parsed,
            },
          })
          return
        }

        const [event, payload] = parsed as StandardMessage

        if (event === 'ping') {
          ws.pong(message)
        }
        else if (event === 'track') {
          const trackingData = payload as Partial<SocketMessageDataItem>

          const config = connectionConfig

          const data = { config, ...trackingData }

          processMessageData('socket', data)
        }
      })

      ws.on('close', () => {
        const clientId = connectionConfig.clientId
        delete __connections[clientId]
      })

      ws.on('error', (error) => {
        logger.log({
          level: 'error',
          context: 'ingest',
          description: 'ws message error',
          data: error,
        })
      })
    }
    catch (error) {
      logger.log({
        level: 'error',
        context: 'ingest',
        description: 'socket handling error',
        data: error,
      })
    }
  })

  wss.on('error', (error) => {
    logger.log({
      level: 'error',
      context: 'ingest',
      description: 'ws connection error',
      data: error,
    })
  })

  /**
   * Primary beacon endpoint
   */
  app.use('/track', async (request, response) => {
    const beacon = JSON.parse(request.body as string) as BeaconData
    const { clientConfig, events, replay, debug } = beacon

    const config = await createConnectionConfig(request, clientConfig)

    await onConnection('http', config)
    processMessageData('http', { config, events, replay, debug })
    response.status(200).end()
  })
  /**
   * Endpoint for debug telemetry from client browsers
   */
  app.use('/debug', (request, response) => {
    const beacon = JSON.parse(
      request.body as string,
    ) as EndpointResponse<unknown>

    const { message, data } = beacon

    logger.log({
      level: 'error',
      description: `client error: ${message ?? 'no message'}`,
      data,
    })

    response.status(200).end()
  })

  app.use('/', (request, response) => {
    response.status(200).send('ingest:ok').end()
  })

  server.listen(port, () => {
    logServiceStatus({ service: 'ingest', port })
  })

  subscribeEvent(
    'notifyClient',
    ({ clientId, data }: { clientId: string, data: JSendMessage }) => {
      notifyClient(clientId, `notify:${data.messageType}`, data)
    },
  )
}
