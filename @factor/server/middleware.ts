import { applyFilters, runCallbacks } from "@factor/api/hooks"
import { getPath } from "@factor/api/paths"
import { setting } from "@factor/api/settings"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import serveFavicon from "serve-favicon"
import { Application } from "express"
import { resolveFilePath } from "@factor/api/resolver"
import { serveStatic } from "./util"
import logger from "./logger"
import { MiddlewarePathConfig } from "./types"
/**
 * Adds all middleware to the primary express server
 * @param app - express app
 * @param middleware - additional middleware
 */
export const loadMiddleware = async (
  app: Application,
  middleware = []
): Promise<void> => {
  /**
   * Add listeners and hooks for server middleware
   * @callback
   */
  runCallbacks("before-middleware", { app })

  const faviconPath = setting("app.faviconPath")
  const fav = resolveFilePath(faviconPath)

  if (fav) app.use(serveFavicon(fav))

  // Serve distribution folder at Root URL
  app.use("/", serveStatic(getPath("dist"), true))

  app.use(logger())
  app.use(compression())
  app.use(helmet())

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  middleware.forEach((_) => app.use(_))

  /**
   * Array of middleware added via extensions or addMiddleware functions
   * @filter
   */
  const ware = applyFilters("middleware", [])

  if (ware.length > 0) {
    ware.forEach(({ path = "/", middleware }: MiddlewarePathConfig) => {
      app.use(path, ...middleware)
    })
  }
}
