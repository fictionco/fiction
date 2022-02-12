import { serverConfigSetting } from "@factor/server/config"
import * as esLexer from "es-module-lexer"
import * as cjsLexer from "cjs-module-lexer"
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
    { id: "fast-safe-stringify" },
    { id: "module", exports: ["createRequire"] },
    ...s,
  ]
}

const getReplacedModule = (opts: {
  id?: string
  src: string
  type: "comment" | "map"
}): string => {
  const { src, id = "?" } = opts

  const fileExports: string[] = []

  if (src.includes("exports")) {
    const { exports: cjsExports } = cjsLexer.parse(src)
    fileExports.push(...cjsExports)
  } else {
    const [_imports, esExports] = esLexer.parse(src)
    fileExports.push(...esExports)
  }

  const modExports = fileExports.filter((_) => _ != "default")

  const mock = `{}`

  const namedExports =
    modExports.length > 0
      ? modExports.map((_) => `export const ${_} = ${mock}`).join(`\n`)
      : ""

  const newSource = [
    `// replaced file: ${id}`,
    `export default ${mock}`,
    `${namedExports}`,
  ].join(`\n`)

  return newSource
}
/**
 * Remove and replace modules only meant for server
 *
 * /0 prefix prevents other plugins from messing with module
 * https://rollupjs.org/guide/en/#conventions
 */
export const getCustomBuildPlugins = async (): Promise<vite.Plugin[]> => {
  const serverOnlyModules = getServerOnlyModules()

  const fullServerModules = serverOnlyModules.map((_) => {
    return {
      ..._,
      resolvedId: `\0${_.id}`,
    }
  })

  await Promise.all([esLexer.init, cjsLexer.init()])

  const plugins: vite.Plugin[] = [
    {
      name: "serverModuleReplacer", // required, will show up in warnings and errors
      enforce: "pre",
      // resolveId(id: string): ResolveIdResult {
      //   const found = fullServerModules.find((_) => _.id == id)
      //   if (found) {
      //     return found.resolvedId
      //   }
      // },
      transform(src: string, id: string) {
        const isServerPackage = fullServerModules.find((_) => {
          return id.includes(`node_modules/${_.id}`)
        })

        const isServerFile = /server-only-file/.test(src)

        if (isServerPackage || isServerFile) {
          const code = getReplacedModule({ src, id, type: "map" })
          return { code, map: null }
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
