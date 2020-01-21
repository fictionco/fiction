import { Server } from "http"
import {
  addCallback,
  runCallbacks,
  applyFilters,
  setting,
  getWorkingDirectory
} from "@factor/api"
import {
  createBundleRenderer,
  BundleRenderer,
  BundleRendererOptions
} from "vue-server-renderer"
import { getPath } from "@factor/api/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import log from "@factor/api/logger"
import LRU from "lru-cache"
import { resolveFilePath } from "@factor/api/resolver"
import Vue from "vue"
import { developmentServer } from "./server-dev"
import { handleServerError, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"
import { RendererComponents } from "./types"

let __listening: Server | undefined
let __application
let __renderer: BundleRenderer // used for dev server updates

interface ServerOptions {
  static?: boolean;
  port?: string;
  renderer?: BundleRenderer;
  cwd?: string;
}

/**
 * Is the server currently restarting?
 * @remarks used to prevent double restart attempts
 */
const isRestarting = (): boolean => {
  return Vue.$restartingServer ? true : false
}
/**
 * Sets a flag used to establish server restart status
 * @param state - server restart state
 */
const setRestarting = (state: boolean): void => {
  Vue.$restartingServer = state
}

/**
 * Server render an application route
 * @param url The relative route to render
 */
export const renderRoute = async (
  url = "",
  renderer: BundleRenderer
): Promise<string> => {
  const currentRenderer = __renderer ? __renderer : renderer

  return await currentRenderer.renderToString({ url })
}

/**
 * Renders HTML based on the url in the express request
 * @param renderer - Vue server renderer
 * @param request - server request
 * @param response - server response
 */
export const renderRequest = async (
  renderer: BundleRenderer,
  request: express.Request,
  response: express.Response
): Promise<void> => {
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Server", getServerInfo())

  try {
    const html = await renderRoute(request.url, renderer)
    response.send(html)
  } catch (error) {
    handleServerError(request, response, error)
  }
}

/**
 * Adds a utility to the listener/server so we can remove it later
 */
const prepareListener = (): void => {
  if (__listening) {
    __listening.destroy = destroyer(__listening)
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

/**
 * Create the express server
 * @library express
 * @param options - server configuration options
 *
 * @remarks
 * This needs to take into account server resets
 */
export const createServer = async (options: ServerOptions): Promise<void> => {
  const { port, renderer } = options || {}

  process.env.PORT = port || process.env.PORT || "3000"

  __application = express()

  loadMiddleware(__application)

  if (renderer) {
    __application.get("*", (request, response) => {
      return renderRequest(renderer, request, response)
    })
  }

  __listening = __application.listen(process.env.PORT, () => {
    logServerReady()
    setRestarting(false)
  })

  prepareListener()

  /**
   * Hook into restart-server callback that occurs on changes, etc.
   */
  addCallback({
    key: "createServer",
    hook: "restart-server",
    callback: async ({ path }: { event?: string; path?: string } = {}): Promise<void> => {
      if (!isRestarting()) {
        setRestarting(true)

        log.server(`restarting server`, { color: "yellow" })

        if (__listening) {
          try {
            __listening.destroy()

            await runCallbacks("rebuild-server-app", { path })

            await createServer(options)
          } catch (error) {
            // If an error is thrown that is subsequently fixed, don't prevent server restart
            setRestarting(false)
            throw error
          }
        }
      }
    }
  })
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
  clientManifest
}: RendererComponents): BundleRenderer => {
  // Allow for changing default options when rendering
  // particularly important for testing
  const options: BundleRendererOptions = applyFilters("server-renderer-options", {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    template,
    clientManifest
  })

  return createBundleRenderer(bundle, options)
}

/**
 * Creates an application renderer
 * @param cwd = working directory
 */
export const appRenderer = (cwd?: string): BundleRenderer => {
  const paths = {
    template: resolveFilePath(setting("app.templatePath", { cwd })),
    bundle: getPath("server-bundle", cwd),
    clientManifest: getPath("client-manifest", cwd)
  }

  const renderComponents = {
    template: fs.readFileSync(paths.template, "utf-8"),
    bundle: require(paths.bundle),
    clientManifest: require(paths.clientManifest)
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
  let renderer: BundleRenderer

  const cwd = getWorkingDirectory(options.cwd)

  if (process.env.NODE_ENV == "development") {
    renderer = await new Promise(resolve => {
      developmentServer({
        cwd,
        fileSystem: options.static ? "static" : "memory",
        onReady: async renderConfig => {
          const renderer = htmlRenderer(renderConfig)

          if (!__listening) {
            options.renderer = renderer
            await createServer(options)
          } else {
            __renderer = renderer
          }

          resolve(renderer)
        }
      })
    })
  } else {
    renderer = appRenderer(cwd)
    options.renderer = renderer
    await createServer(options)
  }

  return renderer
}

export const setup = (): void => {
  addCallback({
    key: "server",
    hook: "create-server",
    callback: (_: ServerOptions) => createRenderServer(_)
  })
  addCallback({
    key: "server",
    hook: "close-server",
    callback: () => closeServer()
  })
}

setup()
