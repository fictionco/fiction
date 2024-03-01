import path from 'node:path'
import type http from 'node:http'
import { createRequire } from 'node:module'
import express from 'express'
import cors from 'cors'
import serveStatic from 'serve-static'
import proxy from 'express-http-proxy'
import apicache from 'apicache'
import compression from 'compression'
import { log } from '@factor/api'
import {
  escapeRegExp,
  getLocalRequestHeaders,
  getNewLocation,
  proxyBaseUrl,
  replaceAll,
  reverseModUrl,
} from '../@kaption/proxy/utils'

const require = createRequire(import.meta.url)

function resolveFrameJs(): string {
  const framePath = path.dirname(require.resolve('@kaption/frame/package.json'))

  const r = path.join(framePath, './dist')

  return r
}

function cacheMiddleware(): express.RequestHandler {
  // clear cache on init
  apicache.clear('')

  // add middleware - BAD TYPES
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const cacheMiddleware: express.RequestHandler = apicache
    .options({
      statusCodes: { include: [200] },
      // @ts-expect-error - bad type
      defaultDuration: 1000 * 60 * 120,
      appendKey: (req: express.Request): string => {
        const { headers, originalUrl, method, protocol } = req
        const host = headers.host || ''

        if (originalUrl.includes('safe_mode'))
          return Math.random().toString(36).slice(2, 7)

        const cacheKey = `${protocol}-${host}-${originalUrl}-${method}`

        return cacheKey
      },
    })
    .middleware()
  return cacheMiddleware
}

export function setup(): void {
  const PORT = process.env.PORT || 6060
  const app = express()

  app.get('/*', cacheMiddleware())
  app.options('/*', cacheMiddleware())

  /**
   * Allow cors
   */
  app.use(cors())

  app.use(compression())

  app.use(serveStatic(resolveFrameJs(), { index: false }))

  app.use('/', async (req, res, next) => {
    const { headers, originalUrl } = req

    const method = req.method as 'POST' | 'GET' | 'OPTIONS' | 'PUT' | 'DELETE'

    // Pre-flight request. Reply successfully:
    if (method === 'OPTIONS')
      return res.writeHead(200, 'pre-flight').end()

    if (originalUrl.includes('favicon'))
      return res.writeHead(200).end()

    const host = headers.host || ''

    const urlString = reverseModUrl(req, host)

    if (!urlString) {
      return res
        .json({ error: `Browser URL is incorrect: ${host}`, headers })
        .end()
    }

    let location: URL
    try {
      location = new URL(urlString)
    }
    catch {
      return res.send(`badly formed url ${req.url.slice(1)}`).end()
    }

    const newHeaders = getLocalRequestHeaders(req, location)

    const url = location.toString()

    req.headers = newHeaders

    const baseOptions: proxy.ProxyOptions | undefined = {
      limit: '8mb',

      userResHeaderDecorator(
        headers: http.IncomingHttpHeaders,
        userReq,
        userRes,
        proxyReq,
        proxyRes,
      ): http.IncomingHttpHeaders {
        // delete headers["set-cookie"]
        // delete headers["set-cookie2"]
        delete headers['x-frame-options']
        // remove cloudflare headers
        delete headers['report-to']
        delete headers['expect-ct']
        delete headers['cf-request-id']
        delete headers.nel
        delete headers['x-cache']
        delete headers.pragma

        const statusCode = proxyRes.statusCode
        const redirectLocation = headers.location

        if (
          redirectLocation
          && (statusCode === 301 || statusCode === 302 || statusCode === 303)
        ) {
          const newLocation = getNewLocation(host, redirectLocation)
          const redirectHeader = headers['k-proxy-redirect-num'] as string
          const redirectNumber = redirectHeader
            ? Number.parseInt(redirectHeader)
            : 0
          headers['x-redirect-num'] = String(redirectNumber + 1)
          headers['x-redirect-location'] = `${statusCode} ${redirectLocation}`
          log.l({
            level: 'info',
            description: 'REDIRECT',
            data: {
              redirectLocation,
              statusCode,
              newLocation,
            },
          })
          if (redirectNumber >= 4) {
            log.l({
              level: 'error',
              description: 'REDIRECT MAX HIT',
              data: {
                redirectLocation,
                statusCode,
                newLocation,
              },
            })
            delete headers.location
          }
          else {
            headers.location = newLocation
          }
        }

        return headers
      },
    }

    const htmlOptions: proxy.ProxyOptions | undefined
      = !location.pathname
      || !location.pathname.includes('.')
      || location.pathname.includes('.html')
      || location.pathname.includes('.php')
        ? {
            userResDecorator: (
              proxyRes,
              proxyResData,
              userReq,
              userRes,
            ): any => {
              const pRes = proxyRes as Record<string, any>
              const h = pRes.headers as Record<string, string>

              const contentType: string = h['content-type'] || ''

              userRes.removeHeader('x-frame-options')
              // userRes.removeHeader("set-cookie")
              // userRes.removeHeader("set-cookie2")

              userRes.removeHeader('content-security-policy')
              userRes.removeHeader('strict-transport-security') // not sure if need to remove this one

              // userRes.getHeaderNames().forEach((name) => {
              //   console.log(name, userRes.getHeader(name))
              // })

              // console.log("userRes.getHeaderNames()", userRes.getHeaderNames())

              if (contentType.includes('html')) {
                const newBase = proxyBaseUrl(host)

                let out: string = (proxyResData as Buffer).toString()

                const baseUrl = newBase.href.replace(/\/$/, '')
                const originalBase = `${location.protocol}//${location.host}`

                // allow for safe_mode which prevents substitution
                // useful for debugging
                log.l({
                  level: 'info',
                  description: 'urlString',
                  data: { urlString, originalUrl },
                })
                if (!originalUrl.includes('safe_mode')) {
                  out = replaceAll(out, originalBase, baseUrl)
                  out = replaceAll(out, `^//${location.host}`, baseUrl)

                  // (<script(?=[^>]*ontraport)[^>]*\><\/script>)
                  // remove script by src attr
                  const libs = [
                    'ontraport',
                    'facebook',
                    'truconversion',
                    'google-analytics',
                    'nr-data',
                    'googleadservices',
                  ]
                  libs.forEach((lib) => {
                    out = out.replace(
                      new RegExp(
                        escapeRegExp(
                          `/(<script(?=[^>]*${lib})[^>]*></script>)/`,
                        ),
                        'g',
                      ),
                      '',
                    )
                  })
                  out = out.replace(
                    /<script>((?!<)[\S\s])*googletagmanager[\S\s]*?<\/script>/,
                    '',
                  )
                }

                return out.replace(
                  /<head([^>]*)>/i,
                  `<head$1>
                  <base href="${baseUrl}">
                  <script>window.__or='${originalBase}'; window.__px='${baseUrl}';</script>
                  <script src="${baseUrl}/frame.js"></script>
                  <link rel="stylesheet" href="${baseUrl}/frame.css">`,
                )
              }
              else {
                return proxyResData
              }
            },
          }
        : undefined

    const options = { ...baseOptions, ...htmlOptions }

    log.l({
      level: 'info',
      context: 'proxy',
      description: `proxy url requested: ${url}`,
    })
    const handler = proxy(url, options)

    return handler(req, res, next)
  })
  /**
   * Listen on port
   */
  app.listen(PORT, () => {
    log.l({
      level: 'info',
      context: 'proxy',
      description: `proxy:${PORT} READY`,
    })
  })
}
