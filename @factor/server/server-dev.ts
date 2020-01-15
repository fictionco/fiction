import path from "path"
import fs from "fs-extra"
import { addFilter, setting, log } from "@factor/api"
import { resolveFilePath } from "@factor/api/resolver"
import chalk from "chalk"
import MFS from "memory-fs"

import ora, { Ora } from "ora"
import webpack, { Configuration } from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import yargs from "yargs"
import { getWebpackConfig } from "@factor/build/webpack-config"

import { watcher } from "./watcher"
import { RendererComponents } from "./types"

interface UpdateBundle {
  ({ bundle, template, clientManifest }: RendererComponents): Promise<void>;
}

type MemorySystemType = typeof fs | MFS

type BuildStatus = "start" | "done" | "loading" | ""
type BuildInfo = { status: BuildStatus; time?: number }

const devServer: Record<string, DevServerComponents> = {}

interface DevServerComponents {
  cwd: string;
  bundle?: string;
  clientManifest?: object;
  template?: string;
  updateSpinner?: Ora | undefined;
  updateLoaders?: {
    [index: string]: BuildInfo | undefined;
    client?: BuildInfo;
    server?: BuildInfo;
  };
  updateBundleCallback: UpdateBundle;
  updateReason?: string;
  configServer: Configuration;
  configClient: Configuration;
}

export interface DevCompilerOptions {
  fileSystem?: string | void;
  devServer: DevServerComponents;
}

const updateBundles = ({
  cwd,
  title = "",
  value = ""
}: {
  cwd: string;
  title?: string;
  value?: string;
}): void => {
  const dev = devServer[cwd]
  if (title) {
    dev.updateReason = chalk.dim(`${title}@${value}`)
  }

  if (dev && dev.bundle && dev.clientManifest && dev.template) {
    const { template, bundle, clientManifest } = dev
    dev.updateBundleCallback({ bundle, template, clientManifest })
  }
}

const loaders = ({
  devServer,
  target = "",
  status = "",
  time
}: {
  devServer: DevServerComponents;
  target?: string;
  status?: BuildStatus;
  time?: number;
}): void => {
  if (!devServer.updateLoaders) {
    devServer.updateLoaders = {}
  }

  if (target) {
    devServer.updateLoaders[target] = { status, time }
  }

  const states: string[] = Object.values(devServer.updateLoaders).map(
    _ => _?.status ?? ""
  )

  if (states.length == 2) {
    if (states.every(_ => _ == "start") && !devServer.updateSpinner) {
      devServer.updateSpinner = ora("building").start()
      devServer.updateLoaders = {
        client: { status: "loading" },
        server: { status: "loading" }
      }
    } else if (
      states.every(_ => _) &&
      !states.some(_ => _ == "start" || _ == "loading") &&
      devServer.updateSpinner
    ) {
      const times: number[] = Object.values(devServer.updateLoaders).map(
        _ => _?.time ?? 0
      )

      const seconds = Math.max(...times) / 1000
      devServer.updateSpinner.succeed(
        ` built` + chalk.dim(` in ${seconds}s ${devServer.updateReason ?? ""}`)
      )
      devServer.updateSpinner = undefined
      devServer.updateLoaders = {}
      devServer.updateReason = ""
      updateBundles({ cwd: devServer.cwd })
    }
  }
}

const createClientCompiler = ({ fileSystem, devServer }: DevCompilerOptions): void => {
  const config = devServer.configClient
  // Webpack config allows entry to be array, string, function
  // WHM requires that we insert it into an entry array
  // Note function mode isn't
  const existingEntry =
    typeof config.entry == "string" ? [config.entry] : (config.entry as string[])

  if (config.output) config.output.filename = "[name].js"

  config.entry = ["webpack-hot-middleware/client?quiet=true", ...existingEntry]

  config.plugins?.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
  ) ?? []

  try {
    // Dev Middleware - which injects changed files into the webpack bundle
    const clientCompiler = webpack(config)

    let devFilesystem = {} // default
    if (fileSystem == "fs") {
      fs.join = path.join // Needed by dev server / webpack convention (exists in memory fs)
      devFilesystem = { fs }
    }

    const publicPath = config.output?.publicPath ?? "/"
    const middleware = {
      dev: webpackDevMiddleware(clientCompiler, {
        publicPath,
        logLevel: "silent",
        ...devFilesystem
      }),
      hmr: webpackHotMiddleware(clientCompiler, { heartbeat: 2000, log: false })
    }

    addFilter({
      key: "devMiddleware",
      hook: "middleware",
      callback: (_: object[]) => {
        const { dev, hmr } = middleware
        return [{ id: "devServer", middleware: [dev, hmr] }, ..._]
      }
    })

    loaders({ devServer, target: "client", status: "start" })
    clientCompiler.plugin("compile", () =>
      loaders({ devServer, target: "client", status: "start" })
    )
    clientCompiler.plugin("done", stats => {
      const { errors, warnings, time } = stats.toJson()

      errors.forEach((error: Error) => log.error(error))
      warnings.forEach((error: Error) => log.warn(error))

      if (errors.length !== 0) return

      const outputPath = config.output?.path ?? ""

      const clientManifestString = middleware.dev.fileSystem.readFileSync(
        path.join(outputPath, "factor-client.json"),
        "utf-8"
      )

      devServer.clientManifest = JSON.parse(clientManifestString)
      loaders({ devServer, target: "client", status: "done", time })
    })

    return
  } catch (error) {
    log.error("[WEBPACK CLIENT COMPILER]", error)
  }
}

const createServerCompiler = ({ fileSystem, devServer }: DevCompilerOptions): void => {
  const config = devServer.configServer
  const serverCompiler = webpack(config)

  let fileSystemUtility: MemorySystemType
  if (fileSystem == "fs") {
    fileSystemUtility = fs
    serverCompiler.outputFileSystem = fs
  } else {
    const mfs = new MFS()

    serverCompiler.outputFileSystem = mfs

    fileSystemUtility = mfs
  }
  loaders({ devServer, target: "server", status: "start" })

  serverCompiler.plugin("compile", () =>
    loaders({ devServer, target: "server", status: "start" })
  )

  serverCompiler.watch({}, (_error: Error, stats) => {
    // watch and update server renderer
    if (_error) throw _error

    const { errors, time } = stats.toJson()

    if (errors.length !== 0) return log.error(errors)

    const outputPath = config.output?.path ?? ""

    const bundleString = fileSystemUtility.readFileSync(
      path.join(outputPath, "factor-server.json"),
      "utf-8"
    )

    devServer.bundle = JSON.parse(bundleString)

    loaders({ devServer, target: "server", status: "done", time })
  })
}

export const initializeDevServer = (cwd: string): void => {
  // Watch for file changes in Factor directories
  watcher(({ event, path }: { event: string; path: string }) => {
    updateBundles({ cwd, title: event, value: path })
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
  cwd
}: {
  fileSystem?: string;
  onReady: UpdateBundle;
  cwd: string;
}): Promise<void> => {
  const templatePath = resolveFilePath(setting("app.templatePath", { cwd }))

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
    configServer
  }

  devServer[cwd] = dev

  //initializeDevServer(cwd)

  createClientCompiler({ fileSystem, devServer: dev })

  createServerCompiler({ fileSystem, devServer: dev })
}
