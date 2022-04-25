import * as esLexer from "es-module-lexer"
import * as cjsLexer from "cjs-module-lexer"
import * as vite from "vite"
import { UserConfig } from "../config/types"

export type ServerModuleDef = {
  id: string
  exports?: string[]
  external?: boolean
  resolvedId?: string
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
export const getCustomBuildPlugins = async (
  userConfig: UserConfig,
): Promise<vite.Plugin[]> => {
  const serverOnlyModules = getServerOnlyModules(userConfig)

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
          return { code }
        }
      },
      config: () => {
        return {
          build: {
            rollupOptions: {
              external: serverOnlyModules
                .filter((_) => _.external)
                .map((_) => _.id),
            },
          },
        }
      },
    },
  ]

  return plugins
}
