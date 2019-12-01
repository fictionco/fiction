import { addFilter, setting, log, runCallbacks } from "@factor/tools"

import chalk from "chalk"
import fs from "fs-extra"
import MFS from "memory-fs"
import ora, { Ora } from "ora"
import path from "path"
import webpack, { Configuration } from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import yargs from "yargs"
import { getWebpackConfig } from "@factor/build/webpack-config"
import { watcher } from "./watcher"
import { getPath } from "@factor/tools/paths"
import { RendererComponents } from "./types"
const argv = yargs.argv

let configServer: Configuration = {}
let configClient: Configuration = {}

let updateBundleCallback: UpdateBundle
let updateReason = ""

let updateLoaders: {
  [index: string]: { status: string; time?: number } | undefined;
  client?: { status: string; time?: number };
  server?: { status: string; time?: number };
} = {}

let updateSpinner: Ora | undefined
let template: string

let bundle: string
let clientManifest: string

function getTemplatePath(): string {
  return setting("app.templatePath")
}

interface UpdateBundle {
  ({ bundle, template, clientManifest }: RendererComponents): void;
}

export async function developmentServer(cb: UpdateBundle): Promise<void> {
  updateBundleCallback = cb

  const templatePath = getTemplatePath()

  if (!templatePath) {
    throw new Error("The index.html template path is not set.")
  }

  configServer = await getWebpackConfig({ target: "server", ...argv })
  configClient = await getWebpackConfig({ target: "client", ...argv })

  template = fs.readFileSync(templatePath, "utf-8")

  watcher(({ event, path }: { event: string; path: string }) => {
    updateBundles({ title: event, value: path })

    // On js file updates, wait for 3 seconds for build
    if (path.includes(".js") || path.includes(".ts")) {
      runCallbacks("restart-server")
    }
  })

  clientCompiler()

  serverCompiler()
}

function loaders(target = "", status = "", time?: number): void {
  if (target) {
    updateLoaders[target] = { status, time }
  }

  const states: string[] = Object.values(updateLoaders).map(_ => _?.status ?? "")

  if (states.length == 2) {
    if (states.every(_ => _ == "start") && !updateSpinner) {
      updateSpinner = ora("Building").start()
      updateLoaders = { client: { status: "loading" }, server: { status: "loading" } }
    } else if (
      states.every(_ => _) &&
      !states.some(_ => _ == "start" || _ == "loading") &&
      updateSpinner
    ) {
      const times: number[] = Object.values(updateLoaders).map(_ => _?.time ?? 0)

      const seconds = Math.max(...times) / 1000
      updateSpinner.succeed(` built` + chalk.dim(` in ${seconds}s ${updateReason}`))
      updateSpinner = undefined
      updateLoaders = {}
      updateReason = ""
      updateBundles()
    }
  }
}

function updateBundles({ title = "", value = "" } = {}): void {
  if (title) updateReason = chalk.dim(`${title} @${value}`)

  if (bundle && clientManifest) {
    updateBundleCallback({ bundle, template, clientManifest })
  }
}

function clientCompiler(): void {
  // Webpack config allows entry to be array, string, function
  // WHM requires that we insert it into an entry array
  // Note function mode isn't
  const existingEntry =
    typeof configClient.entry == "string"
      ? [configClient.entry]
      : (configClient.entry as string[])

  configClient.entry = ["webpack-hot-middleware/client?quiet=true", ...existingEntry]

  configClient.output = { filename: "[name].js" }
  configClient.plugins?.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
  ) ?? []

  try {
    // Dev Middleware - which injects changed files into the webpack bundle
    const clientCompiler = webpack(configClient)

    const publicPath = configClient.output?.publicPath ?? "/"
    const middleware = {
      dev: webpackDevMiddleware(clientCompiler, { publicPath, logLevel: "silent" }),
      hmr: webpackHotMiddleware(clientCompiler, { heartbeat: 2000, log: false })
    }

    addFilter("middleware", (_: object[]) => {
      const { dev, hmr } = middleware
      return [{ id: "devServer", middleware: [dev, hmr] }, ..._]
    })

    loaders("client", "start")
    clientCompiler.plugin("compile", () => loaders("client", "start"))
    clientCompiler.plugin("done", stats => {
      const { errors, warnings, time } = stats.toJson()

      errors.forEach((error: Error) => log.error(error))
      warnings.forEach((error: Error) => log.warn(error))

      if (errors.length !== 0) return

      clientManifest = JSON.parse(
        readFileFromMemory(middleware.dev.fileSystem, "factor-client.json")
      )
      loaders("client", "done", time)
    })

    return
  } catch (error) {
    log.error("[WEBPACK CLIENT COMPILER]", error)
  }
}

function serverCompiler(): void {
  const serverCompiler = webpack(configServer)

  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs

  loaders("server", "start")
  serverCompiler.plugin("compile", () => loaders("server", "start"))

  serverCompiler.watch({}, (_error: Error, stats) => {
    // watch and update server renderer
    if (_error) throw _error

    const { errors, time } = stats.toJson()

    if (errors.length !== 0) return log.error(errors)

    bundle = JSON.parse(readFileFromMemory(mfs, "factor-server.json"))

    loaders("server", "done", time)
  })
}

// Read file using  Memory File Service
function readFileFromMemory(mfs: MFS, file: string): string {
  const basePath = configClient.output?.path ?? getPath("dist")
  return mfs.readFileSync(path.join(basePath, file), "utf-8")
}
