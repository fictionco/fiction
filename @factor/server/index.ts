import { Server } from "http"
import {
  addCallback,
  runCallbacks,
  applyFilters,
  setting,
  getWorkingDirectory,
} from "@factor/api"
import {
  createBundleRenderer,
  BundleRenderer,
  BundleRendererOptions,
} from "vue-server-renderer"
import open from "open"
import { getPath } from "@factor/api/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import LRU from "lru-cache"
import { resolveFilePath } from "@factor/api/resolver"
import log from "@factor/api/logger"
import { renderLoading } from "@factor/loader"
import { systemUrl } from "@factor/api/url"
import { developmentServer } from "./server-dev"
import { handleServerError, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"
import { RendererComponents } from "./types"

let __listening: Server | undefined
let __application: express.Express
let __renderer: BundleRenderer // used for dev server updates

export interface ServerOptions {
  staticFiles?: boolean
  watchServer?: boolean
  port?: string
  renderer?: BundleRenderer
  cwd?: string
  noReloadModules?: boolean
  path?: string
  logOnReady?: boolean
  openOnReady?: boolean
}

/**
 * Is the server currently restarting?
 * @remarks used to prevent double restart attempts
 */
const isRestarting = (): boolean => {
  return process.env.RESTARTING_SERVER == "yes" ? true : false
}
/**
 * Sets a flag used to establish server restart status
 * @param state - server restart state
 */
const setRestarting = (state: "yes" | "no"): void => {
  process.env.RESTARTING_SERVER = state
}
/**
 * Server render an application route
 * @param url The relative route to render
 */
export const renderRoute = async (
  url = "",
  renderer: BundleRenderer
): Promise<string> => {
  return await renderer.renderToString({ url })
}
/**
 * Renders HTML based on the url in the express request
 * @param renderer - Vue server renderer
 * @param request - server request
 * @param response - server response
 */
export const renderRequest = async (
  renderer: BundleRenderer | undefined,
  request: express.Request,
  response: express.Response
): Promise<void> => {
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Server", getServerInfo())

  try {
    /**
     * factorServerStatus >>
     * Allow http status to be changed from inside the app
     */
    process.env.factorServerStatus = "200" // ok

    let html = ""
    if (!renderer) {
      html = renderLoading()
    } else {
      html = await renderRoute(request.url, renderer)
    }

    const serverStatus = Number.parseInt(process.env.factorServerStatus)

    response.status(serverStatus).send(html).end()
  } catch (error) {
    handleServerError(request, response, error)
  }
}

/**
 * Closes and removes port processes etc for existing server
 */
export const closeServer = async (): Promise<void> => {
  if (__listening) {
    __listening.destroy()
  }
}

export const listenServer = async (options: ServerOptions): Promise<void> => {
  const { port, logOnReady, openOnReady } = options || {}

  process.env.PORT = port || process.env.PORT || "3000"

  await new Promise((resolve) => {
    __listening = __application
      .listen(process.env.PORT, () => {
        if (logOnReady) {
          logServerReady()
        }

        if (openOnReady && process.env.FACTOR_ENV !== "test") {
          const openAtUrl = systemUrl("local")
          open(openAtUrl)
        }

        setRestarting("no")
        resolve()
      })
      .on("error", async (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          const usedPort = process.env.PORT || "3000"
          const newPort: string | number = Number.parseInt(usedPort) + 1

          log.log(`Port ${usedPort} is in use, trying ${newPort}...`)

          await listenServer({ ...options, port: String(newPort) })
          resolve()
        } else {
          log.error(error)
        }
      })
  })

  /**
   * Adds a utility to the listener/server so we can remove it later
   */
  if (__listening) {
    __listening.destroy = destroyer(__listening)
  }

  return
}

/**
 * Create the express server
 * @library express
 * @param options - server configuration options
 *
 * @remarks
 * This needs to take into account server resets
 */
export const createServer = async (options: ServerOptions): Promise<void> => {
  __application = express()

  await loadMiddleware(__application)

  __application.get("*", (request, response) => {
    return renderRequest(__renderer, request, response)
  })

  await listenServer(options)

  /**
   * Hook into restart-server callback that occurs on changes, etc.
   */
  addCallback({
    key: "createServer",
    hook: "restart-server",
    callback: async ({ path }: { event?: string; path?: string } = {}): Promise<void> => {
      if (!isRestarting()) {
        setRestarting("yes")

        log.server(`Restarting Server`)
        options.path = path

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await restartServer({ ...options, noReloadModules: false })
      }
    },
  })
}

export const restartServer = async (options: ServerOptions): Promise<void> => {
  if (__listening) {
    try {
      __listening.destroy()

      if (!options.noReloadModules) {
        await runCallbacks("rebuild-server-app", options)
      }

      await createServer(options)
    } catch (error) {
      // If an error is thrown that is subsequently fixed, don't prevent server restart
      setRestarting("no")
      throw error
    }
  } else {
    createServer(options)
  }
}

/**
 * Returns an HTML renderer using Vue client/server bundles
 * @library Vue
 * @param bundle - Vue server bundle
 * @param template - HTML template
 * @param clientManifest - Vue client manifest
 */
export const htmlRenderer = ({
  bundle,
  template,
  clientManifest,
}: RendererComponents): BundleRenderer => {
  // Allow for changing default options when rendering
  // particularly important for testing
  const options: BundleRendererOptions = applyFilters("server-renderer-options", {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    template,
    clientManifest,
  })

  return createBundleRenderer(bundle, options)
}

/**
 * Creates an application renderer
 * @param cwd = working directory
 */
export const appRenderer = (cwd?: string): BundleRenderer => {
  const rawTemplatePath = setting("app.templatePath", { cwd })
  const paths = {
    template: resolveFilePath(rawTemplatePath),
    bundle: getPath("server-bundle", cwd),
    clientManifest: getPath("client-manifest", cwd),
  }

  const renderComponents = {
    template: fs.readFileSync(paths.template, "utf-8"),
    bundle: require(paths.bundle),
    clientManifest: require(paths.clientManifest),
  }

  return htmlRenderer(renderComponents)
}

/**
 * Creates application renderer and runs a server
 * @param options - options for running the server
 * @returns the application renderer being served
 *
 * @remarks
 *  uses NODE_ENV to either create production renderer or use dev server
 */
export const createRenderServer = async (
  options: ServerOptions = {}
): Promise<BundleRenderer> => {
  const cwd = getWorkingDirectory(options.cwd)

  if (process.env.NODE_ENV == "development") {
    await new Promise((resolve) => {
      developmentServer({
        cwd,
        fileSystem: options.staticFiles ? "static" : "memory",
        watchMode: options.watchServer ? "server" : "app",
        onReady: async (renderConfig) => {
          __renderer = htmlRenderer(renderConfig)

          resolve(__renderer)
        },
      })
    })

    await runCallbacks("dev-server-built")
  } else {
    __renderer = appRenderer(cwd)
  }

  await restartServer({ noReloadModules: true, logOnReady: true })

  return __renderer
}

export const setup = (): void => {
  addCallback({
    key: "server",
    hook: "create-server",
    callback: (_: ServerOptions) => createRenderServer(_),
  })
  addCallback({
    key: "server",
    hook: "close-server",
    callback: () => closeServer(),
  })
}

setup()
