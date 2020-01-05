import { dirname } from "path"
import { addFilter } from "@factor/api/hooks"
import { renderRequest, appRenderer } from "@factor/server"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"

const alphaDirectory = dirname(require.resolve("@factor/theme-alpha/package.json"))
addFilter({
  key: "addThemes",
  hook: "build-directories",
  callback: dirs => {
    dirs.push(alphaDirectory)
    return dirs
  }
})

addMiddleware({
  path: "/alpha/*",
  middleware: [
    async (request: Request, response: Response): Promise<void> => {
      const renderer = appRenderer(alphaDirectory)
      return renderRequest(renderer, request, response)
    }
  ]
})

// addFilter({
//   key: "addThemes",
//   hook: "node-alias-cwd",
//   callback: (cwd, { request }) => {
//     return request.includes("/alpha") ? alphaDirectory : cwd
//   }
// })
