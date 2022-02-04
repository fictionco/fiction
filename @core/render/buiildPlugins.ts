import { Plugin, ResolveIdResult, LoadResult } from "rollup"

export type ServerModuleDef = {
  id: string
  exports: string[]
  resolvedId?: string
}
export const getRollupPlugins = (
  serverModules: ServerModuleDef[],
): Plugin[] => {
  const fullServerModules = serverModules.map((_) => {
    return { ..._, exports: _.exports || ["default"], resolvedId: `\0${_.id}` }
  })

  return [
    {
      name: "serverOnly",

      transform(src: string, id: string) {
        const match = src.match(/server-only-file/)

        if (match) {
          console.warn(`server only in build`, { id })

          return {
            code: `console.error("server only file: ${id}")`,
            map: null, // provide source map if available
          }
        }
      },
    },
    {
      name: "serverModuleReplacer", // required, will show up in warnings and errors

      resolveId(id: string): ResolveIdResult {
        const found = fullServerModules.find((_) => _.id == id)
        if (found) {
          return found.resolvedId
        }
      },
      load(id: string): LoadResult {
        const found = fullServerModules.find((_) => _.resolvedId == id)
        if (found) {
          return `const txt = "SERVER_ONLY_MODULE"
                  export {${found.exports.map((_) => `${_} = txt`).join(",")}}`
        }
      },
    },
  ]
}
