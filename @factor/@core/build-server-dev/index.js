const chalk = require("chalk")

const path = require("path")
const MFS = require("memory-fs")
const chokidar = require("chokidar")
const webpack = require("webpack")
const ora = require("ora")

const webpackHotMiddleware = require("webpack-hot-middleware")
const webpackDevMiddleware = require("webpack-dev-middleware")
const argv = require("yargs").argv

export default Factor => {
  return new (class {
    constructor() {
      this._loaders = {}
      this._reason = ""

      this.build = this.production ? "production" : "development"

      Factor.$filters.add("development-server", cb => {
        this.cb = cb

        return this.createRunner()
      })
    }

    createRunner() {
      this.templatePath = Factor.$paths.resolveFilePath("#/index.html")

      if (!this.templatePath) {
        throw new Error("Couldn't locate the index.html template file")
      }

      this.confServer = Factor.$filters.apply("webpack-config", {
        target: "server",
        ...argv
      })

      this.confClient = Factor.$filters.apply("webpack-config", {
        target: "client",
        ...argv
      })

      // this.ready
      // const readyPromise = new Promise(resolve => {
      //   this.ready = resolve
      // })

      this.template = this.getTemplate()

      this.watcher()

      const { middleware } = this.compileClient()

      this.compileServer()

      return { middleware }
    }

    // Read file using Memory File Service
    readFile(mfs, file) {
      try {
        return mfs.readFileSync(path.join(this.confClient.output.path, file), "utf-8")
      } catch (error) {}
    }

    // logServerUpdate({ title, value }) {
    //   const fTitle = chalk.cyan(title)
    //   const fValue = chalk.dim(value)
    //   console.log(`${fTitle} ${fValue}`)
    // }

    loaders(target, value) {
      this._loaders[target] = value

      const vals = Object.values(this._loaders)

      if (vals.length == 2) {
        if (vals.every(_ => _ == "start")) {
          this._spinner = ora("Building").start()
          this._loaders = { client: "loading", server: "loading" }
        } else if (vals.every(_ => _) && !vals.some(_ => _ == "start" || _ == "loading")) {
          this._spinner.succeed(`Built! ${Math.max(...vals) / 1000}s ${this._reason}`)
          this._loaders = {}
          this._reason = ""
          this.updateServer()
        }
      }
    }

    updateServer(args = {}) {
      if (args.title) {
        this._reason = chalk.dim(`${args.title} @${args.value}`)
      }

      if (this.bundle && this.clientManifest) {
        //this.ready() // triggers promise resolution
        this.cb({
          bundle: this.bundle,
          template: this.template,
          clientManifest: this.clientManifest
        })
      }
    }
    getTemplate() {
      return Factor.$files.readHtmlFile(this.templatePath)
    }
    watcher() {
      const watchDirs = Factor.$files.getWatchDirs().map(_ => `${_}/**`)

      chokidar
        .watch([`${Factor.$paths.get("source")}/**`, ...watchDirs], {
          ignoreInitial: true,
          ignored: `**/node_modules/**`
        })
        .on("all", (event, path) => {
          this.updateServer({
            title: event,
            value: path
          })
        })

      const customWatchers = Factor.$filters.apply("build-watchers", [
        {
          name: "Template",
          files: [this.templatePath, Factor.$paths.get("config-file-public"), Factor.$paths.get("config-file-private")],
          callback: () => {
            this.template = this.getTemplate()
          }
        }
      ])

      if (customWatchers.length > 0) {
        customWatchers.forEach(({ name, files, ignored = [], event = "all", callback }) => {
          chokidar.watch(files, { ignored, ignoreInitial: true }).on(event, (event, path) => {
            const update = callback({ event, path })
            if (update || typeof update == "undefined") {
              this.updateServer({
                title: event,
                value: path
              })
            }
          })
        })
      }
    }

    // flat(arr) {
    //   return [].concat.apply([], arr).filter(_ => _)
    // }

    compileClient() {
      // modify client config to work with hot middleware
      this.confClient.entry.app = ["webpack-hot-middleware/client?quiet=true", this.confClient.entry.app]
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

        const middleware = [
          devMiddleware,
          webpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            log: false
          })
        ]
        this.loaders("client", "start")
        clientCompiler.plugin("compile", () => {
          this.loaders("client", "start")
        })
        clientCompiler.plugin("done", stats => {
          stats = stats.toJson()

          stats.errors.forEach(error => consola.error(error))
          stats.warnings.forEach(error => consola.warn(error))

          if (stats.errors.length !== 0) return

          this.clientManifest = JSON.parse(
            this.readFile(devMiddleware.fileSystem, Factor.$paths.get("client-manifest-name"))
          )
          this.loaders("client", stats.time)
        })

        return {
          middleware,
          compiler: clientCompiler
        }
      } catch (error) {
        consola.error("[WEBPACK CLIENT COMPILER]", error)
      }
    }

    compileServer() {
      const serverCompiler = webpack(this.confServer)
      const mfs = new MFS()
      serverCompiler.outputFileSystem = mfs

      this.loaders("server", "start")
      serverCompiler.plugin("compile", () => {
        this.loaders("server", "start")
      })
      serverCompiler.watch({}, (err, stats) => {
        // watch and update server renderer
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length !== 0) {
          console.error(stats.errors)
          return
        }

        this.bundle = JSON.parse(this.readFile(mfs, Factor.$paths.get("server-bundle-name")))

        this.loaders("server", stats.time)
      })
    }
  })()
}
