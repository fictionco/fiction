import http from 'node:http'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { _stop, decodeClientToken, nLog } from '@kaption/utils'
import type { EndpointResponse, SendError } from '@kaption/types'
import ws from 'ws'
import type { AnalyticsEndpoint, StructureMappedType } from './serverTypes'

import { bustSiteScript, getTrackingStatus } from './_site'
import { searchDimension } from './_search'

import type { RequestFullAnalytics } from './_widgets'
import { widgets } from './_widgets'
import { singleSession } from './_widgets/replay'

export const EPMap: StructureMappedType = {
  widgets,
  getTrackingStatus,
  bustSiteScript,
  singleSession,
  searchDimension,
}

export async function createQueryResponse(_action: keyof AnalyticsEndpoint, args: RequestFullAnalytics): Promise<EndpointResponse> {
  let r: EndpointResponse = {
    status: 'fail',
    message: `endpoint method missing ${_action}`,
  }
  try {
    if (!args.projectId)
      throw _stop({ message: 'projectId is missing' })

    if (EPMap[_action]) {
      r = await EPMap[_action](
        args as RequestFullAnalytics & { projectId: string },
      )
    }
  }
  catch (error: unknown) {
    const e = error as SendError
    nLog('error', `endpoint error @${_action}`, e)
    nLog('error', `endpoint params @${_action}`, { args })

    r = {
      status: 'error',
      message: e.expose ? e.message : '',
      code: e.code,
    }
  }

  return r
}

export async function createSocketResponse(action: keyof AnalyticsEndpoint, args: RequestFullAnalytics & { cb: (result: EndpointResponse) => void }): Promise<void> {
  try {
    if (!args.projectId)
      throw _stop({ message: 'projectId is missing' })

    if (EPMap[action]) {
      await EPMap[action](
        args as RequestFullAnalytics & {
          projectId: string
          cb: (result: EndpointResponse) => void
        },
      )
    }
  }
  catch (error: unknown) {
    nLog('error', `request error @${action}`, error)
    nLog('error', `request params @${action}`, { args })

    const e = error as SendError
    args.cb({
      status: 'error',
      message: e.expose ? e.message : '',
      code: e.code,
    })
  }
}

declare module 'http' {
  export interface IncomingMessage {
    user: any
  }
}

/**
 * Creates the API endpoint server
 */
export async function createEndpointServer(args: {
  port: string | number
}): Promise<http.Server> {
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(compression())

  const socketServer = http.createServer(app)

  const wss = new ws.Server({
    server: socketServer,
    maxPayload: 10_000_000,
    // http://iostreamer.me/ws/node.js/jwt/2016/05/08/websockets_authentication.html
    verifyClient: async (info, cb): Promise<void> => {
      const { url: socketPathname = '/' } = info.req
      const search = socketPathname.split('?').pop() ?? ''
      const urlParams = new URLSearchParams(search)

      const token = urlParams.get('token')

      if (!token) { cb(false, 401, 'Unauthorized') }
      else {
        try {
          const result = decodeClientToken(token)
          info.req.user = result
          cb(true)
        }
        catch (error) {
          nLog('error', 'query socket auth error', error)
          cb(false, 401, 'Unauthorized')
        }
      }
    },
  })

  wss.on('connection', (connection, request) => {
    const user = request.user

    connection.send(JSON.stringify(['welcome', user]))

    nLog('debug', `query socket connection - total: ${wss.clients.size}`, {
      user,
    })

    connection.on('message', async (message: string) => {
      let parsed: any
      try {
        parsed = JSON.parse(message)
      }
      catch {
        nLog('error', 'error parsing socket message', { message })
        return
      }

      if (!Array.isArray(parsed)) {
        nLog('error', 'invalid socket message format', { parsed })
        return
      }

      const [event, payload] = parsed as [string, unknown]

      if (event === 'ping') {
        connection.pong(message)
      }
      else if (event === 'query') {
        const { _method, args } = payload as {
          _method: keyof typeof EPMap
          args: RequestFullAnalytics
        }

        await createSocketResponse(_method, {
          ...args,
          cb: (result: EndpointResponse): void => {
            connection.send(JSON.stringify([`result:${_method}`, result]))
          },
        })
      }
    })

    wss.on('error', (error) => {
      nLog(['error', 'api'], 'ws message error', error)
    })
  })

  wss.on('error', (error) => {
    nLog(['error', 'api'], 'ws connection error', error)
  })

  app.use(['/analytics/:_method'], async (request, response): Promise<void> => {
    const _method = request.params._method as keyof AnalyticsEndpoint
    const url = request.url
    try {
      const result = await createQueryResponse(_method, request.body)
      response.status(200).send(result).end()
    }
    catch (error) {
      nLog('error', `endpoint request (${_method}:${url})`, error)
      response
        .status(500)
        .send({ status: 'error', message: 'server error' })
        .end()
    }
  })

  app.use(['/posts/:_method'], async (request, response): Promise<void> => {
    const _method = request.params._method as keyof AnalyticsEndpoint
    const url = request.url
    try {
      const result = {}
      response.status(200).send(result).end()
    }
    catch (error) {
      nLog('error', `endpoint request (${_method}:${url})`, error)
      response
        .status(500)
        .send({ status: 'error', message: 'server error' })
        .end()
    }
  })

  app.use('/', (request, response) => {
    response.status(200).send({ status: 'success', message: 'ok' }).end()
  })

  const server = socketServer.listen(args.port)

  return server
}
