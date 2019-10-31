import { applyFilters, setting } from "@factor/tools"
import { getPath } from "@factor/paths"
import serveFavicon from "serve-favicon"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"

import { serveStatic } from "./util"
import logger from "./logger"

export function loadMiddleware(app, middleware = []) {
  const fav = setting("app.faviconPath")

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

  middleware.forEach(_ => app.use(_))

  const ware = applyFilters("middleware", [])

  if (ware.length > 0) {
    ware.forEach(({ path = "/", middleware }) => {
      app.use.apply(app, [path, ...middleware])
    })
  }
}
