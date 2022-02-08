import { ResolveIdResult, LoadResult } from "rollup"
import { serverConfigSetting } from "@factor/server/config"
import * as vite from "vite"
export type ServerModuleDef = {
  id: string
  exports?: string[]
  resolvedId?: string
}

export const getServerOnlyModules = (): ServerModuleDef[] => {
  const s = serverConfigSetting("serverOnlyImports") ?? []

  return [
    { id: "knex" },
    { id: "knex-stringcase" },
    { id: "bcrypt" },
    { id: "chalk" },
    { id: "express" },
    { id: "nodemailer" },
    { id: "nodemailer-html-to-text" },
    { id: "prettyoutput" },
    { id: "consola" },
    { id: "jsonwebtoken" },
    { id: "lodash" },
    { id: "body-parser" },
    { id: "cors" },
    { id: "helmet" },

    { id: "module", exports: ["createRequire"] },
    ...s,
  ]
}
/**
 * Remove and replace modules only meant for server
 *
 * /0 prefix prevents other plugins from messing with module
 * https://rollupjs.org/guide/en/#conventions
 */
export const getCustomBuildPlugins = (): vite.Plugin[] => {
  const serverOnlyModules = getServerOnlyModules()

  const fullServerModules = serverOnlyModules.map((_) => {
    return { ..._, exports: _.exports || [], resolvedId: `\0${_.id}` }
  })

  const plugins: vite.Plugin[] = [
    {
      name: "serverOnly",
      enforce: "pre",
      transform(src: string, id: string) {
        const match = src.match(/server-only-file/)

        if (match) {
          return {
            code: `console.warn("server only file: ${id}")
                   export default {}`,
            map: null, // provide source map if available
          }
        }
      },
    },
    {
      name: "serverModuleReplacer", // required, will show up in warnings and errors
      enforce: "pre",
      resolveId(id: string): ResolveIdResult {
        const found = fullServerModules.find((_) => _.id == id)
        if (found) {
          return found.resolvedId
        }
      },
      load(id: string): LoadResult {
        const found = fullServerModules.find((_) => _.resolvedId == id)
        if (found) {
          return `// module ${id} replaced
                  const _ = () => "SERVER_ONLY_MODULE"
                  export default _
                  ${found.exports.map((_) => `const ${_} = _\n`)}
                  export {${found.exports.map((_) => _).join(",")}}`
        }
      },
      config: () => {
        return {
          build: {
            rollupOptions: {
              external: serverOnlyModules.map((_) => _.id),
            },
          },
        }
      },
    },
  ]

  return plugins
}
