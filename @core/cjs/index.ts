import { Plugin, ResolveIdResult, LoadResult } from "rollup"

export type ServerModuleDef = {
  id: string
  exports?: string[]
  resolvedId?: string
}

/**
 * Remove and replace modules only meant for server
 *
 * /0 prefix prevents other plugins from messing with module
 * https://rollupjs.org/guide/en/#conventions
 */
export const getCustomBuildPlugins = (
  serverModules: ServerModuleDef[] = [],
): Plugin[] => {
  const serverOnlyModules = [
    { id: "knex" },
    { id: "chalk" },
    { id: "express" },
    { id: "nodemailer" },
    { id: "nodemailer-html-to-text" },
    { id: "prettyoutput" },
    { id: "module", exports: ["createRequire"] },
    ...serverModules,
  ]
  const fullServerModules = serverOnlyModules.map((_) => {
    return { ..._, exports: _.exports || [], resolvedId: `\0${_.id}` }
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
          return `const _ = () => "SERVER_ONLY_MODULE"
                  export default _
                  ${found.exports.map((_) => `const ${_} = _\n`)}
                  export {${found.exports.map((_) => _).join(",")}}`
        }
      },
    },
  ]
}
