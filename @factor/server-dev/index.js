import chalk from "chalk"
import path from "path"
import webpack from "webpack"
import chokidar from "chokidar"
import ora from "ora"
import { addFilter, applyFilters, runCallbacks, setting } from "@factor/tools"
import { getPath } from "@factor/paths"
import MFS from "memory-fs"

import fs from "fs-extra"

import webpackHotMiddleware from "webpack-hot-middleware"
import webpackDevMiddleware from "webpack-dev-middleware"

import yargs from "yargs"

const argv = yargs.argv

import { getFactorDirectories } from "@factor/build/util"

export default Factor => {
  return new (class {
    constructor() {
      this._loaders = {}
      this._reason = ""

      this.build = this.production ? "production" : "development"

      addFilter("development-server", async cb => {
        this.cb = cb

        return await this.createRunner()
      })
    }

    async createRunner() {
      this.templatePath = setting("app.templatePath")

      if (!this.templatePath) {
        throw new Error("Couldn't locate the index.html template file")
      }

      this.confServer = await applyFilters("webpack-config", {
        target: "server",
        ...argv
      })

      this.confClient = await applyFilters("webpack-config", {
        target: "client",
        ...argv
      })

      this.template = fs.readFileSync(this.templatePath, "utf-8")

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

    loaders(target, value) {
      this._loaders[target] = value

      const vals = Object.values(this._loaders)

      if (vals.length == 2) {
        if (vals.every(_ => _ == "start") && !this._spinner) {
          this._spinner = ora("Building").start()
          this._loaders = { client: "loading", server: "loading" }
        } else if (
          vals.every(_ => _) &&
          !vals.some(_ => _ == "start" || _ == "loading") &&
          this._spinner
        ) {
          this._spinner.succeed(`Built ${Math.max(...vals) / 1000}s ${this._reason}`)
          this._spinner = false
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
        this.cb({
          bundle: this.bundle,
          template: this.template,
          clientManifest: this.clientManifest
        })
      }
    }

    watcher() {
      const watchDirs = getFactorDirectories().map(_ => `${_}/**`)

      chokidar
        .watch([`${getPath("source")}/**`, ...watchDirs], {
          ignoreInitial: true,
          ignored: `**/node_modules/**`
        })
        .on("all", async (event, path) => {
          if (
            path.includes("server") ||
            path.includes("endpoint") ||
            path.includes("schema")
          ) {
            await runCallbacks("restart-server")
          }

          this.updateServer({
            title: event,
            value: path
          })
        })
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
          const { errors, warnings, time } = stats.toJson()

          errors.forEach(error => consola.error(error))
          warnings.forEach(error => consola.warn(error))

          if (errors.length !== 0) return

          this.clientManifest = JSON.parse(
            this.readFile(devMiddleware.fileSystem, "factor-client.json")
          )
          this.loaders("client", time)
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

        const { errors, time } = stats.toJson()

        if (errors.length !== 0) {
          console.error(errors)
          return
        }

        this.bundle = JSON.parse(this.readFile(mfs, "factor-server.json"))

        this.loaders("server", time)
      })
    }
  })()
}
