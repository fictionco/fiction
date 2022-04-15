/* server-only-file */
import path from "path"
import http from "http"
import { createRequire } from "module"
import fs from "fs"
import glob from "glob"
import requestIp from "request-ip"
import ipUtil from "ipaddr.js"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import express from "express"
import { PackageJson } from "../types"
import { getNetworkIp } from ".."

const require = createRequire(import.meta.url)
export const cwd = (): string => process.env.FACTOR_CWD ?? process.cwd()
export const packagePath = (): string => path.resolve(cwd(), "package.json")

const mainFileRel = (_cwd?: string): string => {
  const pkgPath = path.resolve(_cwd ?? cwd(), "package.json")
  const pkg = require(pkgPath) as PackageJson
  return pkg.main ?? "index"
}

type WhichModule = {
  moduleName?: string
  cwd?: string
}

export const getMainFilePath = (params: WhichModule = {}): string => {
  return params.moduleName
    ? require.resolve(params.moduleName)
    : path.resolve(params.cwd ?? cwd(), mainFileRel(params.cwd))
}

/**
 * Get source folder for CWD or optional moduleName
 */
export const sourceFolder = (params: WhichModule = {}): string => {
  return path.dirname(getMainFilePath(params))
}

// export const distFolder = (): string => path.join(cwd(), "dist")
// export const distServer = (): string => path.join(distFolder(), "server")
// export const distServerEntry = (): string => path.join(distServer(), "mount")
// export const distClient = (): string => path.join(distFolder(), "client")

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const importIfExists = async <T = unknown>(
  mod: string,
): Promise<T | undefined> => {
  if (fs.existsSync(mod)) {
    return (await import(mod)) as T
  } else return
}

// export const serverRenderEntryConfig = async (
//   params: WhichModule,
// ): Promise<Promise<UserConfig>> => {
//   const mod = await importIfExists<{
//     setup?: () => Promise<UserConfig> | UserConfig
//   }>(mainFilePath(params))

//   // get universal setup
//   let entryConfig = mod?.setup ? await mod.setup() : {}

//   if (entryConfig.server) {
//     const serverConfig = await entryConfig.server()

//     entryConfig = deepMergeAll([entryConfig, serverConfig ?? {}])

//     delete entryConfig.server
//   }

//   return entryConfig
// }

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const requireIfExists = async <T = unknown>(
  mod: string,
): Promise<T | undefined> => {
  let result: T | undefined = undefined
  try {
    result = require(mod) as T
  } catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod)) {
        throw error
      }
    }
  }

  return result
}

export const resolveIfExists = (mod: string): string | undefined => {
  let result: string | undefined = undefined
  try {
    result = require.resolve(mod)
  } catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod)) {
        throw error
      }
    }
  }

  return result
}

export const getFaviconPath = (src: string): string => {
  let faviconPath = ""
  const paths = [`${src}/favicon*`, `${src}/**/favicon*`, `${src}/icon*`]

  paths.some((paths) => {
    const r = glob.sync(paths)

    if (r && r.length > 0) {
      faviconPath = r[0]
      return true
    } else {
      return false
    }
  })

  return faviconPath
}

export const streamToString = async (
  stream?: NodeJS.ReadableStream,
): Promise<string> => {
  if (!stream) return ""
  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err: Error) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

/**
 * Is an IP localhost?
 */
export const isLocalhostIp = (ip: string): boolean => {
  // https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/ipv6-comparefunction
  // 192.168 or c0a8 are local network
  return ip == "127.0.0.1" ||
    ip == "::1" ||
    ip.includes("192.168") ||
    ip.includes("c0a8")
    ? true
    : false
}
/**
 * Normalize IP address to v6
 */
export const normalizeIpv6 = (rawIp: string): string => {
  let ipInstance = ipUtil.parse(rawIp)

  if (ipInstance.kind() == "ipv4") {
    ipInstance = (ipInstance as ipUtil.IPv4).toIPv4MappedAddress()
  }

  return ipInstance.toString()
}
/**
 * All IPs should be stored and handled in ipv6 format
 * https://github.com/ClickHouse/ClickHouse/issues/5462
 */
export const getRequestIpAddress = async (
  request: http.IncomingMessage,
): Promise<{ ip: string; rawIp: string }> => {
  let rawIp = requestIp.getClientIp(request) ?? undefined

  if (!rawIp) {
    return { rawIp: "", ip: "" }
  }

  if (isLocalhostIp(rawIp)) {
    rawIp = await getNetworkIp()
  }

  const ip = normalizeIpv6(rawIp)

  return { rawIp, ip }
}

export const createExpressApp = (): express.Express => {
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(compression())
  return app
}
