const fs = require("fs")
const path = require("path")
const LRU = require("lru-cache")
const https = require("https")
const express = require("express")
const favicon = require("serve-favicon")
const consola = require("consola")

const { createBundleRenderer } = require("vue-server-renderer")

const env = process.env.NODE_ENV || "production"
const isProd = env === "production"

// Add for Firebase
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

module.exports.default = Factor => {
  return new class {
    constructor() {
      // If development or --serve variable is passed
      // We should serve the app (locally)
      this.serveApp = !isProd || Factor.$config.setting("serve") ? true : false

      // After all extensions/filters added
      // Needed for webpack and dev server
      Factor.$filters.add("initialize-build", () => {
        const server = this.startServer()

        Factor.$filters.add("server", () => {
          return server
        })
      })
    }

    resolve(dir, file) {
      return path.resolve(dir, file)
    }

    createRenderer(bundle, options) {
      return createBundleRenderer(bundle, {
        ...options,
        cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
        runInNewContext: false,
        directives: Factor.$filters.applyFilters("server-directives", {})
      })
    }

    // Endpoint Helper method, return function that processes (req, res)
    requestHandler() {
      return (req, res) => {
        this.server(req, res)
      }
    }

    render(req, res) {
      const s = Date.now()

      res.setHeader("Content-Type", "text/html")
      res.setHeader("Server", this.getServerInfo())

      const context = {
        url: req.url,
        metatags: {
          title: "",
          titleSuffix: "",
          image: "",
          canonical: ""
        }
      }

      this.renderer.renderToString(context, (err, html) => {
        if (err) {
          return this.handleError(req, res, err)
        }

        if (
          isProd &&
          (typeof Factor.$config.setting("cache") == "undefined" || Factor.$config.setting("cache"))
        ) {
          res.set("cache-control", this.getCacheControl(req.url))
        }

        res.send(html)

        if (this.serveApp) {
          consola.success(`Request @[${req.url}] - ${Date.now() - s}ms`)
        }
      })
    }

    startServer() {
      this.server = express()

      this.renderer = null
      this.readyPromise = null
      this.httpRoutine = this.getHttpRoutine()

      if (isProd) {
        const bundle = require(Factor.$paths.get("server-bundle"))
        const clientManifest = require(Factor.$paths.get("client-manifest"))

        this.renderer = this.createRenderer(bundle, {
          template: Factor.$files.readHtmlFile(Factor.$paths.get("template")),
          clientManifest
        })
      } else {
        const devServer = Factor.$filters.get("development-server")

        if (devServer) {
          this.readyPromise = devServer(this.server, (bundle, options) => {
            this.renderer = this.createRenderer(bundle, options)
          })
        } else {
          consola.error(
            new Error(
              "No development server added. Add a development server to your app dependencies."
            )
          )
        }
      }

      const middleware = Factor.$filters.apply("middleware", [])
      if (middleware.length > 0) {
        middleware.forEach(({ path, callback }) => {
          this.server.use(path, function(req, res, next) {
            callback(req, res)
            next()
          })
        })
      }

      // Serve static assets
      if (this.serveApp) {
        this.resolveStaticAssets()
      }

      // Set Express routine for all fallthrough paths
      this.server.get("*", (req, res) => {
        if (isProd) {
          this.render(req, res)
        } else {
          this.readyPromise.then(() => {
            this.render(req, res)
          })
        }
      })

      // Serve the app from node
      if (this.serveApp) {
        const port = Factor.$config.setting("port") || 7000

        this.getListenRoutine(this.server).listen(port, () => {
          const url = `${this.httpRoutine.routine}://localhost:${port}`

          consola.success(`Server @[${url}] - ${env}`)

          require("opn")(url)
        })
      }

      return this.server
    }

    getHttpRoutine() {
      let routine = "http"
      let certDir = false
      const filename = "server.key"

      const filepath = require("find-up").sync(filename)

      if (filepath) {
        routine = "https"
        certDir = path.dirname(filepath)
      }

      return { routine, certDir }
    }

    getListenRoutine(server) {
      let listenRoutine
      const { routine, certDir } = this.httpRoutine
      if (routine == "https") {
        var certOptions = {
          key: fs.readFileSync(path.resolve(certDir, "server.key")),
          cert: fs.readFileSync(path.resolve(certDir, "server.crt"))
        }
        listenRoutine = https.createServer(certOptions, server)
      } else {
        listenRoutine = server
      }

      return listenRoutine
    }

    getCacheControl(url) {
      const mins = 60
      console.log(`Cache Control Set @[${url}] for ${mins} minutes.`)
      return `public, max-age=${mins * 30}, s-maxage=${mins * 60}`
    }

    serve(path, cache) {
      return express.static(path, {
        maxAge: cache && isProd ? 1000 * 60 * 60 * 24 : 0
      })
    }

    resolveStaticAssets() {
      const fav = Factor.$paths.get("favicon")
      try {
        this.server.use(favicon(fav))
      } catch (error) {
        consola.warn(`Couldn't find [${fav}]`)
      }

      // Global and Static Images/Manifests, etc..
      this.server.use("/static", this.serve(Factor.$paths.get("static"), true))

      // Serve distribution folder at Root URL
      this.server.use("/", this.serve(Factor.$paths.get("dist"), true))
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
        res.status(500).send("500 | Internal Error")
        consola.error(`error during render : ${req.url}`)
        consola.error(err.stack)
      }
    }
  }()
}
