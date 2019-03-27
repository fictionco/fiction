const fs = require("fs")
const path = require("path")
const MFS = require("memory-fs")
const chokidar = require("chokidar")
const webpack = require("webpack")
const consola = require("consola")
const webpackHotMiddleware = require("webpack-hot-middleware")
const webpackDevMiddleware = require("webpack-dev-middleware")
const argv = require("yargs").argv

export default Factor => {
  return new class {
    constructor() {
      this.build = this.production ? "production" : "development"

      Factor.$filters.add(
        "development-server",
        () => {
          return this.devServer()
        },
        { priority: 500 }
      )
    }

    devServer() {
      this.templatePath = Factor.$paths.get("template")

      this.confServer = Factor.$filters.get("webpack-config", {
        target: "server"
      })

      this.confClient = Factor.$filters.get("webpack-config", {
        target: "client"
      })

      return (server, cb) => {
        this.server = server
        this.cb = cb

        this.ready
        const readyPromise = new Promise(resolve => {
          this.ready = resolve
        })

        this.template = this.getTemplate()

        this.watcher()

        this.compileClient()

        this.compileServer()

        return readyPromise
      }
    }

    // Read file using Memory File Service
    readFile(mfs, file) {
      try {
        return mfs.readFileSync(path.join(this.confClient.output.path, file), "utf-8")
      } catch (error) {}
    }

    updateServer(reason) {
      consola.success(`Update: ${reason}`)
      if (this.bundle && this.clientManifest) {
        this.ready() // triggers promise resolution
        this.cb(this.bundle, {
          template: this.template,
          clientManifest: this.clientManifest
        })
      }
    }
    getTemplate() {
      return Factor.$files.readHtmlFile(this.templatePath)
    }
    watcher() {
      const customWatchers = Factor.$filters.apply("build-watchers", [])

      if (customWatchers.length > 0) {
        customWatchers.forEach(({ name, files, ignored = [], event = "all", callback }) => {
          chokidar.watch(files, { ignored, ignoreInitial: true }).on(event, (event, path) => {
            callback({ event, path })
            this.updateServer(`${name} [${event}@${path}]`)
          })
        })
      }

      const watchers = Factor.$filters.apply("dev-watchers", [
        {
          files: [this.templatePath],
          ignore: [],
          ignoreKeys: [],
          cb: (event, path) => {
            if (path === this.templatePath) {
              this.template = this.getTemplate()
              return true
            }
          }
        }
      ])

      const watchRegen = this.flat(watchers.map(_ => _.files))
      const watchIgnore = this.flat(watchers.map(_ => _.ignore))
      const watchCallbacks = watchers.map(_ => _.cb)

      chokidar
        .watch(watchRegen, {
          ignored: watchIgnore,
          ignoreInitial: true
        })
        .on("all", (event, path) => {
          const result = watchCallbacks.map(cb => cb(event, path))
          if (result.some(_ => _)) {
            this.updateServer("Files Changed")
          }
        })
    }

    flat(arr) {
      return [].concat.apply([], arr).filter(_ => _)
    }

    compileClient() {
      // modify client config to work with hot middleware
      this.confClient.entry.app = [
        "webpack-hot-middleware/client?quiet=true",
        this.confClient.entry.app
      ]
      this.confClient.output.filename = "[name].js"
      this.confClient.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
      )

      try {
        // Dev Middleware - which injects changed files into the webpack bundle
        const clientCompiler = webpack(this.confClient)

        const devMiddleware = webpackDevMiddleware(clientCompiler, {
          publicPath: this.confClient.output.publicPath,
          logLevel: "silent"
        })

        this.server.use(devMiddleware)

        clientCompiler.plugin("done", stats => {
          stats = stats.toJson()
          stats.errors.forEach(error => consola.error(error))
          stats.warnings.forEach(error => consola.warn(error))

          if (stats.errors.length !== 0) return

          this.clientManifest = JSON.parse(
            this.readFile(devMiddleware.fileSystem, Factor.$paths.get("client-manifest-name"))
          )

          this.updateServer("Client Compiler")
        })

        // hot middleware
        this.server.use(
          webpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            log: false
          })
        )

        this.server.getConnections
      } catch (error) {
        consola.error("[WEBPACK CLIENT COMPILER]", error)
      }
    }

    compileServer() {
      const serverCompiler = webpack(this.confServer)
      const mfs = new MFS()
      serverCompiler.outputFileSystem = mfs
      serverCompiler.watch({}, (err, stats) => {
        // watch and update server renderer
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length !== 0) return

        this.bundle = JSON.parse(this.readFile(mfs, Factor.$paths.get("server-bundle-name")))
        this.updateServer("Server Compiler")
      })
    }
  }()
}
