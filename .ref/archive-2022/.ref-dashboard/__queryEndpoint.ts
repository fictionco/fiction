/** server-only-file */
import http from 'node:http'
import type express from 'express'

import { WebSocketServer } from 'ws'
import { logger } from '@factor/api'
import type { EndpointResponse, ErrorConfig } from '@factor/api'
import { decodeClientToken } from '@factor/api/jwt'
import type {
  QueryParams,
  SocketMessage,
  WidgetResults,
} from '@kaption/core/plugin-dashboards/types'
import { runLayoutQuery } from '@kaption/core/plugin-dashboards/layoutQuery'

export interface EngineEndpointMap {
  widgets: {
    request: QueryParams & {
      cb?: (response: EndpointResponse<WidgetResults[]>) => void
    }
    response: EndpointResponse<WidgetResults[]>
  }
}

function getSocketServer(app: express.Express): http.Server {
  const socketServer = http.createServer(app)

  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 10_000_000,
  })

  // https://github.com/websockets/ws/issues/377#issuecomment-462152231
  socketServer.on('upgrade', async (request, socket, head) => {
    try {
      const { url: socketPathname = '/' } = request
      const search = socketPathname.split('?').pop() ?? ''
      const urlParams = new URLSearchParams(search)

      const token = urlParams.get('token')

      // no token needed in dev
      if (process.env.NODE_ENV !== 'development' || token !== 'test') {
        if (!token) {
          throw new Error('unauthorized:noToken')
        }
        else {
          const tokenData = decodeClientToken(token)
          request.bearer = tokenData
          request.bearerToken = token
        }
      }
    }
    catch (error: unknown) {
      const e = error as Error
      logger.log({
        level: 'error',
        context: 'ws:verifyClient',
        description: `token error: ${e.message}`,
        data: { error: e },
      })
      socket.destroy()
      return
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  })

  wss.on('connection', (connection, request) => {
    connection.send(JSON.stringify(['welcome', request.bearer]))

    logger.log({
      level: 'debug',
      context: 'socket',
      description: `connection total: ${wss.clients.size}`,
    })

    connection.on('message', async (message: string) => {
      let parsed: unknown
      try {
        parsed = JSON.parse(message)
      }
      catch {
        logger.log({
          level: 'error',
          context: 'querySocket',
          description: 'error parsing socket message',
          data: { message },
        })
        return
      }

      if (!Array.isArray(parsed)) {
        logger.log({
          level: 'error',
          context: 'querySocket',
          description: 'invalid socket message format',
          data: { parsed },
        })
        return
      }

      const [event, payload] = parsed as SocketMessage

      const sendResult = (result: EndpointResponse): void => {
        const message: [string, any] = [`result:widgets`, result]
        connection.send(JSON.stringify(message))
      }

      if (event === 'ping') {
        connection.pong(message)
      }
      else if (event === 'query') {
        const p = payload as {
          _method: string
          params: QueryParams
        }
        try {
          await runLayoutQuery(p, sendResult)
        }
        catch (error: unknown) {
          logger.log({
            level: 'error',
            context: 'querySocket',
            description: 'request',
            data: { error, payload: p },
          })

          const e = error as ErrorConfig

          sendResult({
            status: 'error',
            message: e.expose ? e.message : '',
            code: e.code,
          })
        }
      }
    })

    wss.on('error', (error) => {
      logger.log({
        level: 'error',
        context: 'querySocket',
        description: 'ws message error',
        data: { error },
      })
    })
  })

  wss.on('error', (error: Error) => {
    logger.log({
      level: 'error',
      context: 'querySocket',
      description: 'ws connection error',
      data: { error },
    })
  })

  return socketServer
}
/**
 * Creates the API endpoint server
 */
// export const createEndpointServer = async (args: {
//   port: string
// }): Promise<http.Server | undefined> => {
//   const { port } = args

//   const engineServer = new EndpointServer({
//     name: "QueryServer",
//     port,
//     endpoints,
//     customServer: (app) => getSocketServer(app),
//   })

//   return await engineServer.createServer()
// }
