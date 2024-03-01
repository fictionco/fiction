import path from 'node:path'
import type http from 'node:http'
import type {
  FactorEnv,
  express,
  vue,
} from '@factor/api'
import {
  EnvVar,
  FactorBundle,
  FactorPlugin,
  createExpressApp,
  regExpEscape,
  replaceAll,
  safeDirname,
  shortId,
  vars,
} from '@factor/api'
import serveStatic from 'serve-static'
import proxy from 'express-http-proxy'
import apicache from 'apicache'
import {
  getLocalRequestHeaders,
  getNewLocation,
  proxyBaseUrl,
  reverseProxyUrl,
} from './utils'

vars.register(() => [new EnvVar({ name: 'PROXY_PORT' })])

interface KaptionProxyServerSettings {
  port: number
  liveUrl: string
  isLive: vue.Ref<boolean>
  factorEnv: FactorEnv
}

export class KaptionProxyServer extends FactorPlugin<KaptionProxyServerSettings> {
  port = this.settings.port
  factorEnv = this.settings.factorEnv
  localUrl = `http://special.localhost:${this.port}`
  liveUrl = this.settings.liveUrl || this.localUrl
  url = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive.value || false
    return isLive ? this.liveUrl : this.localUrl
  })

  packagesPath = safeDirname(import.meta.url, '../..')

  isTest = this.utils.isTest()
  closeCallbacks: (() => void | Promise<void>)[] = []
  isRestart = false
  server?: http.Server
  setup() {}

  constructor(settings: KaptionProxyServerSettings) {
    super('proxyServer', settings)
  }

  async dev(): Promise<void> {
    const factorBundle = new FactorBundle({ factorEnv: this.factorEnv })

    const watchers = await factorBundle.bundlePackages({
      cwds: [this.frameJsDir()],
      watch: true,
      isTest: this.isTest,
      onAllBuilt: async () => {
        await this.createServer()
      },
    })

    this.closeCallbacks.push(async () => {
      watchers.map(w => w.close())
    })
  }

  async close() {
    await Promise.all(this.closeCallbacks.map(cb => cb()))
    this.closeCallbacks = []
  }

  frameJsDir(): string {
    const p = path.join(this.packagesPath, 'proxy-frame/package.json')
    return path.dirname(p)
  }

  resolveFrameJs(): string {
    const kaptionDir = safeDirname(import.meta.url, '../..')

    const r = path.join(kaptionDir, './proxy-frame/dist')

    return r
  }

  cacheMiddleware(): express.RequestHandler {
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
            return shortId()

          const cacheKey = `${protocol}-${host}-${originalUrl}-${method}`

          return cacheKey
        },
      })
      .middleware()
    return cacheMiddleware
  }

  async createServer() {
    if (this.server) {
      this.isRestart = true
      this.server.close()
    }

    const app = createExpressApp({ noHelmet: true })

    // app.get("/*", this.cacheMiddleware())
    // app.options("/*", this.cacheMiddleware())

    // serve static JS added to frame
    app.use(serveStatic(this.resolveFrameJs(), { index: false }))

    app.use('/', async (req, res, next) => {
      const { headers, originalUrl } = req

      const method = req.method as 'POST' | 'GET' | 'OPTIONS' | 'PUT' | 'DELETE'

      // Pre-flight request. Reply successfully:
      if (method === 'OPTIONS')
        return res.writeHead(200, 'pre-flight').end()

      if (originalUrl.includes('favicon'))
        return res.writeHead(200).end()

      const proxyHost: string = headers.host || ''

      this.log.info('proxy initialized', {
        proxyHost,
        pathname: req.originalUrl,
      })

      const urlString = reverseProxyUrl({
        proxyHost,
        pathname: req.originalUrl,
      })

      if (!urlString) {
        return res
          .json({ error: `Browser URL is incorrect: ${proxyHost}`, headers })
          .end()
      }

      let location: URL
      try {
        location = new URL(urlString)
      }
      catch {
        return res.send(`badly formed url ${req.url.slice(1)}`).end()
      }

      this.log.info('proxying URL', {
        data: { toProxy: location.toString(), originalUrl: req.originalUrl },
      })

      const newHeaders = getLocalRequestHeaders(req, location)

      const url = location.toString()

      req.headers = newHeaders

      const baseOptions: proxy.ProxyOptions | undefined = {
        limit: '15mb',

        userResHeaderDecorator: (
          headers: http.IncomingHttpHeaders,
          userReq,
          userRes,
          proxyReq,
          proxyRes,
        ): http.IncomingHttpHeaders => {
          delete headers['x-frame-options']
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
            const newLocation = getNewLocation(proxyHost, redirectLocation)
            const redirectHeader = headers['x-redirect-num'] as string
            const redirectNumber = redirectHeader
              ? Number.parseInt(redirectHeader)
              : 0
            headers['x-redirect-num'] = String(redirectNumber + 1)
            headers['x-redirect-location'] = `${statusCode} ${redirectLocation}`
            this.log.info('redirect', {
              data: {
                redirectLocation,
                statusCode,
                newLocation,
              },
            })
            if (redirectNumber >= 4) {
              this.log.error(`redirect max hit ${redirectNumber}`, {
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
        || location.pathname === '/'
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
                userRes.removeHeader('content-security-policy')
                userRes.removeHeader('strict-transport-security') // not sure if need to remove this one

                if (contentType.includes('html')) {
                  const newBase = proxyBaseUrl(proxyHost)

                  let out: string = (proxyResData as Buffer).toString()

                  const baseUrl = newBase.href.replace(/\/$/, '')
                  const originalBase = `${location.protocol}//${location.host}`

                  // allow for safe_mode which prevents substitution
                  // useful for debugging

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
                          regExpEscape(
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

                  const html = out.replace(
                    /<head([^>]*)>/i,
                    `<head$1>
                  <base href="${baseUrl}">
                  <script>window.__or='${originalBase}'; window.__px='${baseUrl}';</script>
                  <script type="module" src="${baseUrl}/frame/index.js"></script>
                  <link rel="stylesheet" href="${baseUrl}/frame/style.css">`,
                  )

                  this.log.info('returning html', {
                    data: { urlString, originalUrl, htmlLength: html.length },
                  })

                  return html
                }
                else {
                  return proxyResData
                }
              },
            }
          : undefined

      const options = { ...baseOptions, ...htmlOptions }

      // const test = await axios.default.get(url, { headers: { accept: "*/*" } })

      // console.log("TEST", test.data.length)

      const handler = proxy(url, options)

      return handler(req, res, next)
    })
    /**
     * Listen on port
     */
    this.server = app.listen(this.port, () => {
      this.log.info(`proxy server @ ${this.port} [ready]`, {
        data: {
          port: this.port,
          localUrl: this.localUrl,
          liveUrl: this.liveUrl,
          isLive: this.settings.isLive.value || false,
        },
      })
    })

    return this.server
  }
}
