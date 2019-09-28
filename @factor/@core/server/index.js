const LRU = require("lru-cache")
const bodyParser = require("body-parser")
const figures = require("figures")
const express = require("express")
const chalk = require("chalk")
const destroyer = require("server-destroy")

const { createBundleRenderer } = require("vue-server-renderer")
const NODE_ENV = process.env.NODE_ENV || "production"
const IS_PRODUCTION = NODE_ENV === "production"

module.exports.default = Factor => {
  return new (class {
    constructor() {
      // // After all extensions/filters added
      // // Needed for webpack and dev server
      // Factor.$filters.add("create-server", (_, { port }) => {
      //   this.PORT = this.getPort(port)
      //   return [..._, this.startServer()]
      // })

      Factor.$filters.callback("create-server", _ => this.createServer(_))
      Factor.$filters.callback("close-server", _ => this.closeServer(_))
    }

    getPort(port) {
      return port || process.env.PORT || Factor.$config.setting("PORT") || 3000
    }

    createRenderer(bundle, options) {
      // Allow for changing default options when rendering
      // particulary important for testing
      options = Factor.$filters.apply("server-renderer-options", options)
      return createBundleRenderer(bundle, {
        cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
        runInNewContext: false,
        directives: Factor.$filters.apply("server-directives", {}),
        ...options
      })
    }

    async render(request, response) {
      response.setHeader("Content-Type", "text/html")
      response.setHeader("Server", this.getServerInfo())

      const { url } = request
      const context = { url, headTags: {} }

      try {
        const html = await this.renderer.renderToString(context)
        response.set("cache-control", `public, max-age=${15 * 30}, s-maxage=${15 * 60}`)
        response.send(html)
      } catch (error) {
        this.handleError(request, response, error)
      }
    }

    async ssrFiles() {
      const paths = {
        template: Factor.$paths.resolveFilePath("#/index.html"),
        bundle: Factor.$paths.get("server-bundle"),
        clientManifest: Factor.$paths.get("client-manifest")
      }

      return {
        template: Factor.$files.readHtmlFile(paths.template),
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
        async (request, response) => await this.render(request, response)
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
        await this.render(request, response)
      })
      this.listener = this.localListenRoutine(this.serverApp).listen(this.PORT, () => {
        if (onListen) {
          onListen()
        }
      })
      destroyer(this.listener)

      Factor.$events.$on("restart-server", async () => {
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
      const { middleware } = Factor.$filters.apply("development-server", bundled => {
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

      if (NODE_ENV == "production") {
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
              if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"))
              if (url.match(/(js|svg|jpg|png|css|json)$/gi)) {
                return true
              } else if (url.match(/__webpack_hmr/gi)) {
                return true
              } else {
                return false
              }
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

      const ware = Factor.$filters.apply("middleware", [])

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
        maxAge: cache && IS_PRODUCTION ? 1000 * 60 * 60 * 24 : 0
      })
    }

    serveStaticAssets() {
      const fav = Factor.$paths.resolveFilePath("#/static/favicon.png", "static")
      if (fav) {
        this.serverApp.use(require("serve-favicon")(fav))
      }

      // // Global and Static Images/Manifests, etc..
      // this.serverApp.use("/static", this.serveStatic(Factor.$paths.get("static"), true))

      // Serve distribution folder at Root URL
      this.serverApp.use("/", this.serveStatic(Factor.$paths.get("dist"), true))
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
