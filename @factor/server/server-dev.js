import { addFilter, applyFilters, runCallbacks, setting } from "@factor/tools"
import { getPath } from "@factor/paths"
import chalk from "chalk"
import chokidar from "chokidar"
import fs from "fs-extra"
import log from "@factor/logger"
import MFS from "memory-fs"
import ora from "ora"
import path from "path"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import yargs from "yargs"

const argv = yargs.argv

import { getFactorDirectories } from "@factor/build/util"

let configServer
let configClient

let updateCallback
let updateReason
const updateLoaders = {}
let updateSpinner
let template

let bundle
let clientManifest
const templatePath = setting("app.templatePath")

addFilter("development-server", async callback => {
  updateCallback = callback

  return await createServerCompilers()
})

async function getWebpackConfig(_arguments) {
  return await applyFilters("webpack-config", { ..._arguments, ...argv })
}

export async function createServerCompilers() {
  if (!templatePath) throw new Error("The index.html template path is not set.")

  configServer = await getWebpackConfig({ target: "server" })
  configClient = await getWebpackConfig("webpack-config", { target: "client" })
  template = fs.readFileSync(templatePath, "utf-8")

  watchDevelopmentFiles()

  clientCompiler()

  serverCompiler()
}

function watchDevelopmentFiles() {
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

      updateServer({ title: event, value: path })
    })
}

// Read file using Memory File Service
function readFileFromMemory(mfs, file) {
  return mfs.readFileSync(path.join(configClient.output.path, file), "utf-8")
}

function loaders(target, value) {
  updateLoaders[target] = value

  const vals = Object.values(updateLoaders)

  if (vals.length == 2) {
    if (vals.every(_ => _ == "start") && !updateSpinner) {
      updateSpinner = ora("Building").start()
      updateLoaders = { client: "loading", server: "loading" }
    } else if (
      vals.every(_ => _) &&
      !vals.some(_ => _ == "start" || _ == "loading") &&
      updateSpinner
    ) {
      updateSpinner.succeed(`Built ${Math.max(...vals) / 1000}s ${updateReason}`)
      updateSpinner = false
      updateLoaders = {}
      updateReason = ""
      updateServer()
    }
  }
}

function updateServer({ title, value } = {}) {
  if (title) updateReason = chalk.dim(`${title} @${value}`)

  if (bundle && clientManifest) {
    updateCallback({ bundle, template, clientManifest })
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

    const middleware = {
      dev: webpackDevMiddleware(clientCompiler, {
        publicPath: configClient.output.publicPath,
        logLevel: "silent"
      }),
      hmr: webpackHotMiddleware(clientCompiler, { heartbeat: 5000, log: false })
    }

    addFilter("middleware", _ => {
      const { dev, hmr } = middleware
      return [{ middleware: dev }, { middleware: hmr }, ..._]
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
    consola.error("[WEBPACK CLIENT COMPILER]", error)
  }
}

function serverCompiler() {
  const serverCompiler = webpack(configServer)

  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs

  loaders("server", "start")
  serverCompiler.plugin("compile", () => loaders("server", "start"))

  serverCompiler.watch({}, (err, stats) => {
    // watch and update server renderer
    if (err) throw err

    const { errors, time } = stats.toJson()

    if (errors.length !== 0) return log.error(errors)

    bundle = JSON.parse(readFileFromMemory(mfs, "factor-server.json"))

    loaders("server", time)
  })
}
