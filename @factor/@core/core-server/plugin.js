const path = require("path")
const LRU = require("lru-cache")
const https = require("https")
const express = require("express")

const { createBundleRenderer } = require("vue-server-renderer")

const env = process.env.NODE_ENV || "production"
const isProd = env === "production"

// Add for Firebase
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

module.exports.default = Factor => {
  return new (class {
    constructor() {
      // After all extensions/filters added
      // Needed for webpack and dev server
      Factor.$filters.add("create-server", (_, args) => {
        const { env: mode = "production", serve = true } = args

        return [..._, this.startServer({ mode, serve })]
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
        const util = require("util")
        console.log(
          "x-forwarded-host",
          request.headers["x-forwarded-host"] ? request.headers["x-forwarded-host"] : util.inspect(request.headers)
        )

        const args = { mode: "production", serve: false }
        const server = await this.startServer(args)
        return server(request, response)
      }
    }

    render(request, response, args = {}) {
      const { serve = true } = args

      const s = Date.now()

      response.setHeader("Content-Type", "text/html")
      response.setHeader("Server", this.getServerInfo())

      const { url } = request
      const context = { url, extend: {} }

      // TODO make await instead of callback
      this.renderer.renderToString(context, (error, html) => {
        if (error) {
          return this.handleError(request, response, error)
        }

        if (isProd && (typeof Factor.$config.setting("cache") == "undefined" || Factor.$config.setting("cache"))) {
          response.set("cache-control", this.getCacheControl(url))
        }

        response.send(html)

        if (serve) {
          Factor.$log.success(`Request @[${url}] - ${Date.now() - s}ms`)
        }
      })
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
      const { mode = "production", serve = true, url } = args

      this.server = express()

      this.renderer = null
      this.developmentBuildReadyPromise = null
      this.httpDetails = Factor.$paths.getHttpDetails()

      if (mode == "production") {
        const { template, bundle, clientManifest } = await this.ssrFiles(args)

        this.renderer = this.createRenderer(bundle, { template, clientManifest })
      } else {
        const devServer = Factor.$filters.apply("development-server")

        if (devServer) {
          this.developmentBuildReadyPromise = devServer(this.server, (bundle, options) => {
            this.renderer = this.createRenderer(bundle, options)
          })
        } else {
          Factor.$log.error(new Error("No development server found."))
        }
      }

      if (serve) {
        var proxy = require("http-proxy-middleware")
        this.resolveStaticAssets()
        this.server.use(
          "**",
          proxy("**", { target: "http://localhost:5001/fiction-com/us-central1/server", xfwd: true })
        )
      } else {
        const middleware = Factor.$filters.apply("middleware", [])
        if (middleware.length > 0) {
          middleware.forEach(({ path, callback }) => {
            this.server.use(path, function(request, response, next) {
              callback(request, response, next)
            })
          })
        }

        // Serve static assets
        if (serve) {
          this.resolveStaticAssets()
        }

        // Set Express routine for all fallthrough paths
        this.server.get("*", (request, response) => {
          if (mode == "production") {
            this.render(request, response, args)
          } else {
            this.developmentBuildReadyPromise.then(() => {
              this.render(request, response)
            })
          }
        })
      }

      // Serve the app from node
      if (serve) {
        const { port, routine } = this.httpDetails

        this.getListenRoutine(this.server).listen(port, () => {
          const url = Factor.$paths.localhostUrl()

          Factor.$log.success(`Server @[${url}] - ${env}`)

          require("opn")(url)
        })

        // Also listen http on alt port
        if (routine == "https") {
          this.server.listen(port + 1)
        }
      }

      return this.server
    }

    getListenRoutine(server) {
      const { routine, certConfig } = this.httpDetails

      let listenRoutine = routine == "https" ? https.createServer(certConfig, server) : server

      return listenRoutine
    }

    getCacheControl(url) {
      const mins = 60
      console.log(`Cache Control Set @[${url}] for ${mins} minutes.`)
      return `public, max-age=${mins * 30}, s-maxage=${mins * 60}`
    }

    serveStatic(path, cache) {
      return express.static(path, {
        maxAge: cache && isProd ? 1000 * 60 * 60 * 24 : 0
      })
    }

    resolveStaticAssets() {
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
