const LRU = require("lru-cache")

const express = require("express")
const chalk = require("chalk")
const { createBundleRenderer } = require("vue-server-renderer")
const NODE_ENV = process.env.NODE_ENV || "production"
const FACTOR_ENV = process.env.FACTOR_ENV || NODE_ENV
const IS_PRODUCTION = NODE_ENV === "production"

// Add for Firebase
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

module.exports.default = Factor => {
  const PORT = process.env.PORT || Factor.$config.setting("PORT") || 3000

  return new (class {
    constructor() {
      // After all extensions/filters added
      // Needed for webpack and dev server
      Factor.$filters.add("create-server", (_, args) => {
        const { serve = true } = args

        return [..._, this.startServer({ serve })]
      })
    }

    createRenderer(bundle, options) {
      return createBundleRenderer(bundle, {
        ...options,
        cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
        runInNewContext: false,
        directives: Factor.$filters.apply("server-directives", {})
      })
    }

    // Endpoint Helper method, return function that processes (req, res)
    requestHandler() {
      return async (request, response) => {
        const args = { serve: false }
        const server = await this.startServer(args)
        return server(request, response)
      }
    }

    async render(request, response, args = {}) {
      const { serve = true } = args

      response.setHeader("Content-Type", "text/html")
      response.setHeader("Server", this.getServerInfo())

      const { url } = request
      const context = { url, extend: {} }

      try {
        const html = await this.renderer.renderToString(context)
        response.set("cache-control", `public, max-age=${15 * 30}, s-maxage=${15 * 60}`)
        response.send(html)
      } catch (error) {
        this.handleError(request, response, error)
      }
    }

    async ssrFiles(args) {
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

    async startServer(args) {
      const { serve = true, url } = args

      this.server = express()

      this.extendMiddleware()

      this.serveStaticAssets()

      this.logging()

      if (NODE_ENV == "production") {
        const { template, bundle, clientManifest } = await this.ssrFiles(args)

        this.renderer = this.createRenderer(bundle, { template, clientManifest })

        // Set Express routine for all fallthrough paths
        this.server.get("*", async (request, response) => await this.render(request, response, args))

        this.server.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))
      } else {
        const devServer = Factor.$filters.apply("development-server")

        this.developmentBuildReadyPromise = devServer(this.server, (bundle, options) => {
          this.renderer = this.createRenderer(bundle, options)
        })

        // Set Express routine for all fallthrough paths
        this.server.get("*", async (request, response) => {
          await this.developmentBuildReadyPromise
          await this.render(request, response)
        })

        this.localListenRoutine(this.server).listen(PORT, () => {
          const url = Factor.$paths.localhostUrl()

          const message = {
            title: "Development Server",
            lines: [
              { title: "URL", value: url, indent: true },
              { title: "NODE_ENV", value: NODE_ENV, indent: true },
              { title: "FACTOR_ENV", value: FACTOR_ENV, indent: true }
            ]
          }
          Factor.$log.formatted(message)

          require("open")(url)
        })
      }

      return this.server
    }

    logging() {
      this.server.use(
        require("morgan")(
          (tokens, req, res) => {
            const seconds = tokens["response-time"](req, res) / 1000
            const time = seconds.toFixed(3)
            const details = [`${time}s`]

            const contentLength = tokens.res(req, res, "content-length")
            if (contentLength) details.push(`Size: ${contentLength}`)

            details.push(`${tokens.method(req, res)}:${tokens.status(req, res)}`)

            return `${chalk.cyan(tokens.url(req, res))} ${chalk.dim(details.join(" "))}`
          },
          {
            skip: (request, response) => {
              let { url } = request
              if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"))
              if (url.match(/(js|jpg|png|css|json)$/gi)) {
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
      const middleware = Factor.$filters.apply("middleware", [])
      if (middleware.length > 0) {
        middleware.forEach(({ path, callback }) => {
          this.server.use(path, function(request, response, next) {
            callback(request, response, next)
          })
        })
      }
    }

    localListenRoutine(server) {
      const { routine, certConfig } = Factor.$paths.getHttpDetails()
      return routine == "https" ? require("https").createServer(certConfig, server) : server
    }

    serveStatic(path, cache) {
      return express.static(path, {
        maxAge: cache && IS_PRODUCTION ? 1000 * 60 * 60 * 24 : 0
      })
    }

    serveStaticAssets() {
      const fav = Factor.$paths.resolveFilePath("#/static/favicon.png", "static")
      if (fav) {
        this.server.use(require("serve-favicon")(fav))
      }

      // Global and Static Images/Manifests, etc..
      this.server.use("/static", this.serveStatic(Factor.$paths.get("static"), true))

      // Serve distribution folder at Root URL
      this.server.use("/", this.serveStatic(Factor.$paths.get("dist"), true))
    }

    getServerInfo() {
      const { version: expressVersion } = require("express/package.json")
      const { version: ssrVersion } = require("vue-server-renderer/package.json")
      return `express/${expressVersion} vue-server-renderer/${ssrVersion}`
    }

    handleError(req, res, err) {
      if (err.url) {
        res.redirect(err.url)
      } else if (err.code === 404) {
        res.status(404).send("404 | Page Not Found")
      } else {
        Factor.$log.info(`Factor Server Error  @[${req.url}]`)
        Factor.$log.error(err)
        res.status(500).send(this.wrp("500 | Server Error"))
      }
    }
    wrp(txt) {
      return `<h1 style="font-family: -apple-system, helvetica, arial;text-align: center;margin: 2em; opacity:.1; font-weight: 400;">${txt}</h1>`
    }
  })()
}
