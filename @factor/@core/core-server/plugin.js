const fs = require("fs")
const path = require("path")
const LRU = require("lru-cache")
const https = require("https")
const express = require("express")
const favicon = require("serve-favicon")

const { createBundleRenderer } = require("vue-server-renderer")

const env = process.env.NODE_ENV || "production"
const isProd = env === "production"

// Add for Firebase
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

module.exports.default = Factor => {
  return new (class {
    constructor() {
      // If development or --serve variable is passed
      // We should serve the app (locally)
      this.serveApp = !isProd || Factor.$config.setting("serve") ? true : false

      // After all extensions/filters added
      // Needed for webpack and dev server
      Factor.$filters.add("create-server", (_, args) => {
        const { env: mode = "production", serve = true } = args

        _.localServer = () => this.startServer({ mode, serve })
        return _
      })
    }

    instance() {
      return this.server
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
        const args = { mode: "production", serve: false }
        const server = this.startServer(args)
        return server(req, res)
      }
    }

    render(req, res, args = {}) {
      const { serve = true } = args

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

        if (isProd && (typeof Factor.$config.setting("cache") == "undefined" || Factor.$config.setting("cache"))) {
          res.set("cache-control", this.getCacheControl(req.url))
        }

        res.send(html)

        if (serve) {
          Factor.$log.success(`Request @[${req.url}] - ${Date.now() - s}ms`)
        }
      })
    }

    startServer(args) {
      const { mode = "production", serve = true } = args

      this.server = express()

      this.renderer = null
      this.readyPromise = null
      this.httpDetails = Factor.$paths.getHttpDetails()

      if (mode == "production") {
        const template = Factor.$paths.resolveFilePath("index.html")
        const bundle = require(Factor.$paths.get("server-bundle"))
        const clientManifest = require(Factor.$paths.get("client-manifest"))

        this.renderer = this.createRenderer(bundle, {
          template: Factor.$files.readHtmlFile(template),
          clientManifest
        })
      } else {
        const devServer = Factor.$filters.get("development-server")

        if (devServer) {
          this.readyPromise = devServer(this.server, (bundle, options) => {
            this.renderer = this.createRenderer(bundle, options)
          })
        } else {
          Factor.$log.error(
            new Error("No development server added. Add a development server to your app dependencies.")
          )
        }
      }

      const middleware = Factor.$filters.apply("middleware", [])
      if (middleware.length > 0) {
        middleware.forEach(({ path, callback }) => {
          this.server.use(path, function(req, res, next) {
            callback(req, res, next)
          })
        })
      }

      // Serve static assets
      if (serve) {
        this.resolveStaticAssets()
      }

      // Set Express routine for all fallthrough paths
      this.server.get("*", (req, res) => {
        if (mode == "production") {
          this.render(req, res, args)
        } else {
          this.readyPromise.then(() => {
            this.render(req, res)
          })
        }
      })

      // Serve the app from node
      if (serve) {
        const { port } = this.httpDetails

        this.getListenRoutine(this.server).listen(port, () => {
          const url = Factor.$paths.localhostUrl()

          Factor.$log.success(`Server @[${url}] - ${env}`)

          require("opn")(url)
        })
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

    serve(path, cache) {
      return express.static(path, {
        maxAge: cache && isProd ? 1000 * 60 * 60 * 24 : 0
      })
    }

    resolveStaticAssets() {
      const fav = Factor.$paths.resolveFilePath("favicon.png", "static")
      try {
        this.server.use(favicon(fav))
      } catch (error) {
        //Factor.$log.warn(`Couldn't find Favicon @[${fav}]`)
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
        res.status(500).send(this.wrp("500 | Server Error"))
        Factor.$log.error(`error during render : ${req.url}`)
        Factor.$log.error(err.stack)
      }
    }
    wrp(txt) {
      return `<h1 style="font-family: -apple-system, helvetica, arial;text-align: center;margin: 2em; font-size: 1em;opacity:.3;">${txt}</h1>`
    }
  })()
}
