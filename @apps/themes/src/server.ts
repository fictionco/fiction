import { dirname } from "path"
import { addFilter } from "@factor/api/hooks"
import { getPath } from "@factor/api/paths"
import { renderRequest, appRenderer } from "@factor/server"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"
import { serveStatic } from "@factor/server/util"
const alphaDirectory = dirname(require.resolve("@factor/theme-alpha/package.json"))
addFilter({
  key: "addThemes",
  hook: "build-directories",
  callback: dirs => {
    dirs.push({
      cwd: alphaDirectory,
      controlFiles: [{ file: require.resolve("./control-theme"), target: "app" }]
    })
    return dirs
  }
})

addMiddleware({
  path: ["/alpha", "/alpha/*"],
  middleware: [
    async (request: Request, response: Response): Promise<void> => {
      const renderer = appRenderer(alphaDirectory)

      return renderRequest(renderer, request, response)
    }
  ]
})

addMiddleware({
  path: "/",
  middleware: [serveStatic(getPath("dist", alphaDirectory), true)]
})
