import path from "path"
import fs from "fs-extra"
import { addFilter, runCallbacks, setting, log } from "@factor/api"
import { resolveFilePath } from "@factor/api/resolver"
import chalk from "chalk"
import MFS from "memory-fs"
import webpack, { Configuration, Stats } from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackProgressPlugin from "webpack/lib/ProgressPlugin"
import cliProgress, { SingleBar } from "cli-progress"
import yargs from "yargs"
import { getWebpackConfig } from "@factor/build/webpack-config"
import { getFactorDirectories } from "@factor/cli/extension-loader"
import { getPath } from "@factor/api/paths"
import chokidar from "chokidar"
import { emitEvent } from "@factor/api/events"
import { setBuilding } from "@factor/cli/loading"
import { RendererComponents } from "./types"
interface UpdateBundle {
  ({ bundle, template, clientManifest }: RendererComponents): Promise<void>
}

type MemorySystemType = typeof fs | MFS

const devServer: Record<string, DevServerComponents> = {}

interface DevServerComponents {
  cwd: string
  bundle?: string
  clientManifest?: Record<string, any>
  template?: string
  updateBundleCallback: UpdateBundle
  updateReason?: string
  configServer: Configuration
  configClient: Configuration
}

export interface DevCompilerOptions {
  fileSystem?: "static" | "memory" | void
  devServer: DevServerComponents
}

/**
 * If server bundles are changed, let the server renderer know
 */

const updateBundles = ({
  cwd,
}: {
  cwd: string
  title?: string
  value?: string
}): void => {
  const dev = devServer[cwd]

  const { template, bundle, clientManifest } = dev

  if (clientManifest && bundle && template) {
    dev.updateBundleCallback({ bundle, template, clientManifest })
    /**
     * reset back to undefined to prevent mismatching updates
     */
    devServer[cwd].clientManifest = undefined
    devServer[cwd].bundle = undefined
  }
}

/**
 * The webpack compiler for the client/browser environment
 * @param fileSystem - use memory or static file system
 * @param devServer - dev server config
 */
const createClientCompiler = ({ fileSystem, devServer }: DevCompilerOptions): void => {
  const config = devServer.configClient
  // Webpack config allows entry to be array, string, function
  // HMR requires that we insert it into an entry array
  // Note function mode isn't
  const existingEntry =
    typeof config.entry == "string" ? [config.entry] : (config.entry as string[])

  /**
   * Can't use [contenthash] with HMR
   */
  if (config.output) {
    config.output.filename = "[name].js"
  }

  const hotEntry = "webpack-hot-middleware/client?noInfo=true&quiet=true"

  config.entry = [hotEntry, ...existingEntry]

  config.plugins?.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
  ) ?? []

  try {
    /**
     * Dev Middleware - which injects changed files into the webpack bundle
     */
    const clientCompiler = webpack(config)

    const bar: SingleBar = new cliProgress.SingleBar(
      {
        hideCursor: true,
        clearOnComplete: true,
        format: `${chalk.hex("#0471ff")(`{bar}`)} {percentage}% {msg}`,
      },
      cliProgress.Presets.shades_classic
    )

    setBuilding(true)

    bar.start(100, 0, { msg: "" })
    emitEvent("buildProgress", "bundle", { progress: 0, message: "building app" })
    let percent = 0
    clientCompiler.apply(
      new webpackProgressPlugin((ratio: number, msg: string) => {
        percent = ratio * 100 > percent ? ratio * 100 : percent
        bar.update(percent, { msg })
        emitEvent("buildProgress", "bundle", { progress: percent, message: msg })
      })
    )

    let devFilesystem = {} // default
    if (fileSystem == "static") {
      fs.join = path.join // Needed by dev server / webpack convention (exists in memory fs)
      devFilesystem = { fs }
    }

    const publicPath = config.output?.publicPath ?? "/"
    const middleware = {
      dev: webpackDevMiddleware(clientCompiler, {
        publicPath,
        logLevel: "silent",
        ...devFilesystem,
      }),
      hmr: webpackHotMiddleware(clientCompiler, {
        heartbeat: 5000,
        log: false,
      }),
    }

    addFilter({
      key: "devMiddleware",
      hook: "middleware",
      callback: (_: Record<string, any>[]) => {
        const { dev, hmr } = middleware
        return [{ id: "devServer", middleware: [dev, hmr] }, ..._]
      },
    })

    clientCompiler.plugin("compile", () => {})

    clientCompiler.plugin("done", (stats: Stats): void => {
      const { errors, warnings } = stats.toJson()

      setBuilding(false)
      bar.stop()

      errors.forEach((err) => log.error(err))
      warnings.forEach((err) => log.warn(err))

      if (errors.length > 0) return

      const outputPath = config.output?.path ?? ""

      const clientManifestString = middleware.dev.fileSystem.readFileSync(
        path.join(outputPath, "factor-client.json"),
        "utf-8"
      )

      const clientManifest = JSON.parse(clientManifestString)

      devServer.clientManifest = clientManifest

      updateBundles({ cwd: devServer.cwd })
    })

    return
  } catch (error) {
    log.error("CLIENT COMPILER", error)
  }
}

/**
 * Creates the hot compiler for the server bundles
 * @param filesystem - use memory file system (default for webpack), or static file system
 * @param devServer - the config of the development server
 */
const createServerCompiler = ({ fileSystem, devServer }: DevCompilerOptions): void => {
  const config = devServer.configServer
  const serverCompiler = webpack(config)

  let fileSystemUtility: MemorySystemType
  if (fileSystem == "static") {
    fileSystemUtility = fs
    serverCompiler.outputFileSystem = fs
  } else {
    const mfs = new MFS()

    serverCompiler.outputFileSystem = mfs

    fileSystemUtility = mfs
  }

  serverCompiler.plugin("compile", () => {})

  serverCompiler.watch({}, (_error: Error, stats) => {
    if (_error) {
      emitEvent("buildError", _error)
      throw _error
    }

    const { errors } = stats.toJson()

    if (errors.length > 0) return

    const outputPath = config.output?.path ?? ""

    const bundleString = fileSystemUtility.readFileSync(
      path.join(outputPath, "factor-server.json"),
      "utf-8"
    )

    const serverBundle = JSON.parse(bundleString)
    devServer.bundle = serverBundle

    updateBundles({ cwd: devServer.cwd })
  })
}

/**
 * Watch for file changes in Factor directories
 * @param cwd - working directory of app
 */
export const watcherDevServer = ({
  cwd,
}: {
  cwd: string
  devServer: DevServerComponents
}): void => {
  const watchDirs = getFactorDirectories().map((_) => `${_}/**`)

  chokidar
    .watch([`${getPath("source")}/**`, ...watchDirs], {
      ignoreInitial: true,
      ignored: `**/+(node_modules|test)/**`,
    })
    .on("all", async (event, path) => {
      if (event == "change") {
        setTimeout(() => {
          updateBundles({ cwd, title: event, value: path })

          if (path.includes(".ts") || path.includes(".js")) {
            runCallbacks("restart-server")
          }
        }, 1500)
      }
    })
}

/**
 * Create a development server based on a working directory
 * @param fileSystem - use webpack memory file system or use static files (better for debugging)
 * @param onReady - callback to fire each time a development server rebuild is finished
 * @param cwd - working directory for dev server
 */
export const developmentServer = async ({
  fileSystem,
  onReady,
  watchMode,
  cwd,
}: {
  fileSystem?: "static" | "memory"
  watchMode: "server" | "app"
  onReady: UpdateBundle
  cwd: string
}): Promise<void> => {
  const rawPath = setting("app.templatePath", { cwd })
  const templatePath = resolveFilePath(rawPath)

  if (!templatePath) {
    throw new Error("The index.html template path is not set.")
  }

  const configServer = await getWebpackConfig({ cwd, target: "server", ...yargs.argv })
  const configClient = await getWebpackConfig({ cwd, target: "client", ...yargs.argv })

  const dev = {
    cwd,
    updateBundleCallback: onReady,
    template: fs.readFileSync(templatePath, "utf-8"),
    configClient,
    configServer,
  }

  devServer[cwd] = dev

  if (watchMode == "server") {
    watcherDevServer({ cwd, devServer: dev })
  }

  createClientCompiler({ fileSystem, devServer: dev })

  createServerCompiler({ fileSystem, devServer: dev })
}
