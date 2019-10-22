const LRU = require("lru-cache")
const bodyParser = require("body-parser")
const figures = require("figures")
const express = require("express")
const chalk = require("chalk")
const destroyer = require("server-destroy")
const { readFileSync } = require("fs-extra")
const { createBundleRenderer } = require("vue-server-renderer")
import Factor from "@factor/core"
import { getPath } from "@factor/paths/util"
import { addCallback, applyFilters } from "@factor/filters/util"

export default () => {
  return new (class {
    constructor() {
      addCallback("create-server", _ => this.createServer(_))
      addCallback("close-server", _ => this.closeServer(_))
    }

    getPort(port) {
      return port || process.env.PORT || Factor.$setting.get("PORT") || 3000
    }

    createRenderer(bundle, options) {
      // Allow for changing default options when rendering
      // particulary important for testing
      options = applyFilters("server-renderer-options", options)
      return createBundleRenderer(bundle, {
        cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
        runInNewContext: false,
        directives: applyFilters("server-directives", {}),
        ...options
      })
    }

    async renderRequest(request, response) {
      response.setHeader("Content-Type", "text/html")
      response.setHeader("Server", this.getServerInfo())

      try {
        const { url } = request
        const html = await this.renderRoute({ url })

        response.set("cache-control", `public, max-age=${15 * 30}, s-maxage=${15 * 60}`)
        response.send(html)
      } catch (error) {
        this.handleError(request, response, error)
      }
    }

    // SSR - Renders a route (url) to HTML.
    async renderRoute({ url }) {
      const context = { url }

      return await this.renderer.renderToString(context)
    }

    async ssrFiles() {
      const paths = {
        template: Factor.$setting.get("app.templatePath"),
        bundle: getPath("server-bundle"),
        clientManifest: getPath("client-manifest")
      }

      return {
        template: readFileSync(paths.template, "utf-8"),
        bundle: require(paths.bundle),
        clientManifest: require(paths.clientManifest)
      }
    }

    async startServerProduction() {
      this.createServerApp()
      const { template, bundle, clientManifest } = await this.ssrFiles()

      this.renderer = this.createRenderer(bundle, { template, clientManifest })

      // Set Express routine for all fallthrough paths
      this.serverApp.get(
        "*",
        async (request, response) => await this.renderRequest(request, response)
      )

      this.serverApp.listen(this.PORT, () =>
        Factor.$log.success(`Listening on PORT: ${this.PORT}`)
      )
    }

    createServerApp() {
      this.serverApp = express()

      this.serveStaticAssets()

      this.logging()

      this.extendMiddleware()

      return this.serverApp
    }

    startListener(onListen) {
      this.createServerApp()
      // Set Express routine for all fallthrough paths
      this.serverApp.get("*", async (request, response) => {
        await this.renderRequest(request, response)
      })
      this.listener = this.localListenRoutine(this.serverApp).listen(this.PORT, () => {
        if (onListen) {
          onListen()
        }
      })
      destroyer(this.listener)

      addCallback("restart-server", async () => {
        Factor.$log.formatted({ title: `Server file changed, restarting server...` })
        this.listener.destroy()
        await Factor.$filters.run("rebuild-server-app")
        this.startListener(this.onListenMessage)
      })
    }

    onListenMessage() {
      const { arrowUp, arrowDown } = figures
      Factor.$log.log(chalk.cyan(`${arrowUp}${arrowDown}`) + chalk.dim(` Ready`))
    }

    async startServerDevelopment() {
      const { middleware } = applyFilters("development-server", bundled => {
        const { bundle, template, clientManifest } = bundled
        this.renderer = this.createRenderer(bundle, { template, clientManifest })

        if (!this.listener) {
          this.startListener(this.onListenMessage)
        }
      })

      this.middleware.push(middleware)
    }

    async createServer({ port }) {
      this.PORT = this.getPort(port)

      this.middleware = []

      if (process.env.NODE_ENV == "production") {
        await this.startServerProduction()
      } else {
        await this.startServerDevelopment()
      }

      return
    }

    async closeServer() {
      this.listener.destroy()
    }

    logging() {
      this.serverApp.use(
        require("morgan")(
          (tokens, req, res) => {
            const seconds = tokens["response-time"](req, res) / 1000
            const time = seconds.toFixed(3)
            const details = []

            if (req.body.method) {
              details.push(chalk.cyan(`${figures.arrowRight} ${req.body.method}`))
            }

            details.push(`${time}s`)

            const contentLength = tokens.res(req, res, "content-length")
            if (contentLength) details.push(`Size: ${Math.round(contentLength / 1000)}kb`)

            details.push(`${tokens.method(req, res)}:${tokens.status(req, res)}`)

            let url = tokens.url(req, res)

            // Server requests to endpoints have null as the value for url
            // This is due to proxy
            if (url.includes("null")) {
              url = chalk.cyan(`server ${figures.arrowRight} ${url.split("null")[1]}`)
            }

            return `${chalk.cyan(figures.arrowUp) +
              chalk.cyan(figures.arrowDown)} Request: ${chalk.cyan(url)} ${chalk.dim(
              details.join(" ")
            )}`
          },
          {
            skip: (request, response) => {
              let { url } = request
              if (url.indexOf("?") > 0) url = url.slice(0, url.indexOf("?"))

              return url.match(/(js|svg|jpg|png|css|json)$/gi) ||
                url.match(/__webpack_hmr/gi)
                ? true
                : false
            }
          }
        )
      )
    }

    extendMiddleware() {
      this.serverApp.use(require("compression")())
      this.serverApp.use(require("helmet")())

      // parse application/x-www-form-urlencoded
      this.serverApp.use(bodyParser.urlencoded({ extended: false }))

      // parse application/json
      this.serverApp.use(bodyParser.json())

      this.middleware.forEach(_ => this.serverApp.use(_))

      const ware = applyFilters("middleware", [])

      if (ware.length > 0) {
        ware.forEach(({ path = "/", middleware }) => {
          const _arguments = [path, ...middleware]
          this.serverApp.use.apply(this.serverApp, _arguments)
        })
      }
    }

    localListenRoutine(server) {
      const { routine, certConfig } = Factor.$paths.getHttpDetails()
      return routine == "https"
        ? require("https").createServer(certConfig, server)
        : server
    }

    serveStatic(path, cache) {
      return express.static(path, {
        maxAge: cache && process.env.NODE_ENV == "production" ? 1000 * 60 * 60 * 24 : 0
      })
    }

    serveStaticAssets() {
      const fav = Factor.$setting.get("app.faviconPath")
      if (fav) {
        this.serverApp.use(require("serve-favicon")(fav))
      }

      // Serve distribution folder at Root URL
      this.serverApp.use("/", this.serveStatic(getPath("dist"), true))
    }

    getServerInfo() {
      const { version: expressVersion } = require("express/package.json")
      const { version: ssrVersion } = require("vue-server-renderer/package.json")
      return `express/${expressVersion} vue-server-renderer/${ssrVersion}`
    }

    handleError(request, response, error) {
      if (error.url) {
        response.redirect(error.url)
      } else if (error.code === 404) {
        response.status(404).send("404 | Page Not Found")
      } else {
        Factor.$log.info(`Factor Server Error  @[${request.url}]`)

        Factor.$log.error(error)
        response.status(500).send(this.wrp("500 | Server Error"))
      }
    }
    wrp(txt) {
      return `<h1 style="font-family: -apple-system, helvetica, arial;text-align: center;margin: 2em; opacity:.1; font-weight: 400;">${txt}</h1>`
    }
  })()
}
