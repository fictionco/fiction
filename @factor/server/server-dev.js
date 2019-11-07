import {
  addFilter,
  applyFilters,
  setting,
  log,
  addCallback,
  runCallbacks
} from "@factor/tools"
import chalk from "chalk"
import fs from "fs-extra"
import MFS from "memory-fs"
import ora from "ora"
import path from "path"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import yargs from "yargs"

import { watcher } from "./watcher"

const argv = yargs.argv

let configServer
let configClient

let updateBundleCallback
let updateReason = ""
let updateLoaders = {}
let updateSpinner
let template

let bundle
let clientManifest

function getTemplatePath() {
  return setting("app.templatePath")
}

addCallback("development-server", async callback => {
  updateBundleCallback = callback

  return await createServerCompilers()
})

async function getWebpackConfig(_arguments) {
  return await applyFilters("webpack-config", { ..._arguments, ...argv })
}

export async function createServerCompilers() {
  const templatePath = getTemplatePath()

  if (!templatePath) {
    throw new Error("The index.html template path is not set.")
  }

  configServer = await getWebpackConfig({ target: "server" })
  configClient = await getWebpackConfig({ target: "client" })

  template = fs.readFileSync(templatePath, "utf-8")

  watcher(({ event, path }) => {
    updateBundles({ title: event, value: path })

    // On js file updates, wait for 3 seconds for build
    if (path.includes(".js")) {
      runCallbacks("restart-server")
    }
  })

  clientCompiler()

  serverCompiler()
}

function loaders(target = "", value = "") {
  if (target) {
    updateLoaders[target] = value
  }

  const values = Object.values(updateLoaders)

  if (values.length == 2) {
    if (values.every(_ => _ == "start") && !updateSpinner) {
      updateSpinner = ora("Building").start()
      updateLoaders = { client: "loading", server: "loading" }
    } else if (
      values.every(_ => _) &&
      !values.some(_ => _ == "start" || _ == "loading") &&
      updateSpinner
    ) {
      updateSpinner.succeed(`Built ${Math.max(...values) / 1000}s ${updateReason}`)
      updateSpinner = false
      updateLoaders = {}
      updateReason = ""
      updateBundles()
    }
  }
}

function updateBundles({ title, value } = {}) {
  if (title) updateReason = chalk.dim(`${title} @${value}`)

  if (bundle && clientManifest) {
    updateBundleCallback({ bundle, template, clientManifest })
  }
}

function clientCompiler() {
  // modify client config to work with hot middleware
  configClient.entry.app = [
    "webpack-hot-middleware/client?quiet=true",
    configClient.entry.app
  ]
  configClient.output.filename = "[name].js"
  configClient.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
  )

  try {
    // Dev Middleware - which injects changed files into the webpack bundle
    const clientCompiler = webpack(configClient)

    const publicPath = configClient.output.publicPath
    const middleware = {
      dev: webpackDevMiddleware(clientCompiler, {
        publicPath,
        logLevel: "silent"
      }),
      hmr: webpackHotMiddleware(clientCompiler, { heartbeat: 2000, log: false })
    }

    addFilter("middleware", _ => {
      const { dev, hmr } = middleware
      return [{ id: "devServer", middleware: [dev, hmr] }, ..._]
    })

    loaders("client", "start")
    clientCompiler.plugin("compile", () => loaders("client", "start"))
    clientCompiler.plugin("done", stats => {
      const { errors, warnings, time } = stats.toJson()

      errors.forEach(error => log.error(error))
      warnings.forEach(error => log.warn(error))

      if (errors.length !== 0) return

      clientManifest = JSON.parse(
        readFileFromMemory(middleware.dev.fileSystem, "factor-client.json")
      )
      loaders("client", time)
    })

    return { compiler: clientCompiler }
  } catch (error) {
    log.error("[WEBPACK CLIENT COMPILER]", error)
  }
}

function serverCompiler() {
  const serverCompiler = webpack(configServer)

  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs

  loaders("server", "start")
  serverCompiler.plugin("compile", () => loaders("server", "start"))

  serverCompiler.watch({}, (_error, stats) => {
    // watch and update server renderer
    if (_error) throw _error

    const { errors, time } = stats.toJson()

    if (errors.length !== 0) return log.error(errors)

    bundle = JSON.parse(readFileFromMemory(mfs, "factor-server.json"))

    loaders("server", time)
  })
}

// Read file using  Memory File Service
function readFileFromMemory(mfs, file) {
  return mfs.readFileSync(path.join(configClient.output.path, file), "utf-8")
}
