import { dirname } from "path"
import { addFilter } from "@factor/api/hooks"
import { getPath } from "@factor/api/paths"
import { renderRequest, appRenderer } from "@factor/server"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"
import { serveStatic } from "@factor/server/util"

const addBaseRouteCode = (name: string): string => {
  return `import { addFilter } from "@factor/api/hooks"

addFilter({
  hook: "app-base-route",
  key: "addSubAppPath",
  callback: () => {
    return "/${name}"
  }
})`
}

const dirs = [
  { name: "ultra", dir: dirname(require.resolve("@factor/theme-ultra/package.json")) },
  { name: "alpha", dir: dirname(require.resolve("@factor/theme-alpha/package.json")) },
  { name: "zeno", dir: dirname(require.resolve("@factor/theme-zeno/package.json")) }
]

dirs.forEach(({ name, dir }) => {
  addFilter({
    key: `theme-${name}`,
    hook: "build-directories",
    callback: dirs => {
      dirs.push({
        cwd: dir,
        config: { output: { publicPath: `/${name}/` } },
        controlFiles: [
          {
            writeFile: {
              content: addBaseRouteCode(name),
              filename: `control-theme-${name}.ts`
            },
            target: "app"
          }
        ]
      })
      return dirs
    }
  })

  const dist = getPath("dist", dir)
  addMiddleware({
    path: `/${name}`,
    middleware: [serveStatic(dist, true)]
  })
})

dirs.forEach(({ name, dir }) => {
  addMiddleware({
    path: [`/${name}`, `/${name}/*`],
    middleware: [
      async (request: Request, response: Response): Promise<void> => {
        const renderer = appRenderer(dir)

        return renderRequest(renderer, request, response)
      }
    ]
  })
})
