import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { getPath } from "@factor/api/paths"
import { setting } from "@factor/api/settings"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import serveFavicon from "serve-favicon"
import { Application, Request, Response, NextFunction } from "express"
import { resolveFilePath } from "@factor/api/resolver"
import { initLoader } from "@factor/loader"
import { serveStatic } from "./util"
import logger from "./logger"
export interface MiddlewareHandler {
  (request: Request, response: Response, next: NextFunction): void;
}

export interface MiddlewarePathConfig {
  path: string;
  middleware: MiddlewareHandler[];
}

/**
 * Add middleware to the Factor server
 * @param path - route to serve the middleware
 * @param middleware - express style middleware handler
 * @param key - unique key for the middleware (prevents double loading)
 */
export const addMiddleware = ({
  path,
  middleware,
  key
}: {
  path: string | string[];
  middleware: MiddlewareHandler[];
  key?: string;
}): void => {
  const pathKey = typeof path == "string" ? path : path.join("")
  key = key ? key : pathKey
  pushToFilter({ key, hook: "middleware", item: { path, middleware } })
}

/**
 * Adds all middleware to the primary express server
 * @param app - express app
 * @param middleware - additional middleware
 */
export const loadMiddleware = (app: Application, middleware = []): void => {
  const faviconPath = setting("app.faviconPath")
  const fav = resolveFilePath(faviconPath)

  if (fav) app.use(serveFavicon(fav))

  // Serve distribution folder at Root URL
  app.use("/", serveStatic(getPath("dist"), true))

  app.use(logger())
  app.use(compression())
  app.use(helmet())

  if (process.env.NODE_ENV == "development") {
    initLoader()
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  middleware.forEach(_ => app.use(_))

  const ware = applyFilters("middleware", [])

  if (ware.length > 0) {
    ware.forEach(({ path = "/", middleware }: MiddlewarePathConfig) => {
      app.use(path, ...middleware)
    })
  }
}
